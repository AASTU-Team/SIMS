import { Request, Response } from "express";
import mongoose from "mongoose";

const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];
const Json2csvParser = require("json2csv").Parser;
import path from "path";

const Curriculum = require("../../models/curriculum.model");
const Department = require("../../models/department.model");
const Course = require("../../models/course.model");

// export const uploadFile = (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const results: any = [];

//   const file: any = req.file;

//   // Process the uploaded CSV file
//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data: any) => results.push(data))
//     .on("end", () => {
//       // Remove the temporary file
//       fs.unlinkSync(file.path);

//       // Do something with the parsed CSV data
//       console.log(results);

//       // Return a response
//       res.json({ message: "File uploaded and processed successfully" });
//     })
//     .on("error", (error: any) => {
//       // Handle any errors
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     });
// };

export const getCurriculum = async (req: Request, res: Response) => {
  // fetch curriculum based on id from the auth
  // and courses should have name
  try {
    // use find({dep_id : id from fetch })
    const curriculums: any = await Curriculum.find().populate("courses").populate("department_id");

    const curriculumView = curriculums.map((curriculum: any) => {
      return {
        ...curriculum.toObject(),
        department_name: curriculum.department_id?.name,
      };
    });
    if (!curriculums) {
      return res.status(404).json({ message: "curriculums not found." });
    }
    console.log(curriculumView);
    res.status(200).json({ data: curriculumView });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportCurriculums = async (req: Request, res: Response) => {
  // fetch curriculum based on id from the auth
  // and courses should have name
  try {
    // use find({dep_id : id from fetch })
    const curriculums: any = await Curriculum.find().populate("courses").populate("department_id");

    const curriculumView = curriculums.map((curriculum: any) => {
      return {
        ...curriculum.toObject(),
        department_name: curriculum.department_id?.name,
      };
    });
    if (!curriculums) {
      return res.status(404).json({ message: "curriculums not found." });
    }
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(curriculumView);
    const filePath = path.join('./exports', 'curriculums.csv');

        fs.writeFile(filePath, csvData, function(error:any) {
          if (error) throw error;
          console.log("Write to csv was successfull!");
       
        });
// Get the path to the CSV file on the server
const csvFilePath = path.join( './exports', 'curriculums.csv');

// Set the path to the downloads folder
const downloadsPath = path.join(require('os').homedir(), 'Downloads', 'curriculums.csv');

// Create a read stream for the CSV file
const readStream = fs.createReadStream(csvFilePath);

// Create a write stream to the downloads folder
const writeStream = fs.createWriteStream(downloadsPath);

// Pipe the read stream to the write stream
readStream.pipe(writeStream);

// Set the necessary headers to trigger a download
await writeStream.on('open', () => {
  res.setHeader('Content-Disposition', 'attachment; filename=curriculums.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).json({ message: "successfully exported" });
});
      
    console.log('Data exported to curriculums.csv');

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getCurriculumById = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { id } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const curriculum: any = await Curriculum.findById({ _id: id });
    if (!curriculum)
      return res.status(404).json({ message: "Department not found." });
    res.status(200).json({ data: curriculum });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const createCurriculum = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newCurriculum = await new Curriculum(data);
    await newCurriculum.save();
    return res
      .status(201)
      .json({ message: "success", Department: newCurriculum });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createCurriculumCsv = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  let errors: String[] = [""];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data: any) => {
      // Process each row of data
      results.push(data);
    })
    .on("end", async () => {
      try {
        // The parsing is complete
        console.log(results);

        let i = 0;

        async function courseNameToObjectId(name: string): Promise<string> {
          const course = await Course.findOne({ code: name });
          console.log("course", course);
          if (!course) {
            errors.push("Could not find course: " + name);
            // Handle the error case accordingly
          }
          return course._id;
        }
        async function getDeparmentId(name: string): Promise<string> {
          const department_id = await Department.findOne({ name: name });

          if (!department_id) {
            errors.push("could not find department" + results[0].department);
          }

          return department_id._id;
        }

        const transformedData = await Promise.all(
          results.map(async (item: any, index: number) => {
            const courseNames = item.course.split(",");
          /*   const semesters = item.semester
              .split(",")
              .map((semester: any) => parseInt(semester)); */

            const courses = await Promise.all(
              courseNames.map(async (courseName: any, index: any) => (
               // {
               // courseId: await courseNameToObjectId(courseName),
               // semester: semesters[index],
             // }
             await courseNameToObjectId(courseName)
            ))
            );

            const departmentId = await getDeparmentId(
              results[index].department
            ); // Await the Promise

            return {
              name: results[index].name,
              department_id: departmentId, // Use the resolved value
              credits_required: results[index].credits_required,
              year: results[index].year,
              semester:results[index].semester,
              courses: courses,

            };
          })
        );

        /*   for (const curriculum of results) {

      const department_id = await Department.findOne({name:curriculum.department});
      did = department_id
      if(!department_id)
        {
          errors.push("could not find department" + curriculum.department)
          
        }
      

   
      const { error } = validateCurriculum(curriculum);
      if (error) {
        console.error('Validation error:', error);
        continue; // Skip this student and move to the next one
        
      }

      

     
      //await Curriculum.create(curriculum);
      i++
    
    } */
        await Curriculum.create(transformedData);
        results = []

        console.log("Data inserted successfully");
       return res.status(200).json({ message: transformedData, errors: errors });
      } catch (error: any) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: error.message,errors });
      }
    })
    .on("error", (error: any) => {
      // Handle any errors that occur during the parsing
      console.error(error);
      res.status(500).json({ message: error.message });
    });
};
function validateCurriculum(curriculum: any) {
  const schema = Joi.object({
    name: Joi.string(),
    department: Joi.string().optional(),
    credits_required: Joi.number().integer(),
    year: Joi.date(),
    course: Joi.string(),
    semester: Joi.string(),
  });

  return schema.validate(curriculum);
}
export const updateCurriculum = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestData = req.body;
    const updates = await Curriculum.findByIdAndUpdate(id, requestData, {
      new: true,
    }).exec();
    if (!updates) {
      return res.status(500).json({ message: "An error happened" });
    } else {
      console.log("Document updated successfully!");
      return res.status(200).json({ message: updates });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const updateCurriculumCourse = async (req: Request, res: Response) => {
  const { courses } = req.body;
  const { id } = req.params;
  const courseSet = new Set(courses);
  console.log(courses, id, courseSet);
  try {
    const curriculum = await Curriculum.findById(req.params.id);
    if (!curriculum) {
      return res.sendStatus(404);
    }

    const filteredCourses = courses?.filter((course: any) => {
      return curriculum.courses?.find((c: any) => {
        console.log(c.courseId.toString(), course.courseId);
        return c?.courseId.toString() != course.courseId;
      });
    });

    const update = await Curriculum.findByIdAndUpdate(
      id,
      {
        $addToSet: { courses: filteredCourses },
      },
      { neww: true }
    );
    res.status(201).json(update);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
export const removeCurriculumCourse = async (req: Request, res: Response) => {
  const { courses } = req.body;
  const { id } = req.params;
  try {
    const curriculum = await Curriculum.findByIdAndUpdate(
      id,
      {
        $pull: { courses: { courseId: { $in: courses } } },
      },
      { new: true }
    );
    if (!curriculum) {
      return res.sendStatus(404);
    }
    res.status(201).json({ message: "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const deleteCurriculum = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCurriculum = await Curriculum.findByIdAndDelete({ _id: id });
    if (!deletedCurriculum) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
// export const registerStudentCsv = async (req: Request, res: Response) => {
//   const currentYear = new Date().getFullYear();
//   const subtractedYear = currentYear - 8;
//   const year = subtractedYear % 100;

//   console.log(year);

//   const count = await Student.countDocuments();
//   console.log(`Total number of documents: ${count}`);
//   let idPrefix = "ets";

//   fs.createReadStream("./students.csv")
//     .pipe(csv())
//     .on("data", (data: any) => {
//       // Process each row of data
//       results.push(data);
//     })
//     .on("end", async () => {
//       try {
//         // The parsing is complete
//         console.log(results);

//         const c = await Student.countDocuments();
//         let count = parseInt(c);
//         let idPrefix = "ets";
//         const emails: String[] = [];

//         for (const student of results) {
//           // Validate each student object
//           emails.push(student.email);
//           const { error } = validateStudent(student);
//           if (error) {
//             console.error("Validation error:", error);
//             continue; // Skip this student and move to the next one
//           }

//           // Generate an auto-incrementing ID
//           let id: String = "";

//           if (count < 10) {
//             id = `${idPrefix}000${count + 1}` + `/${year}`;
//           } else if (count < 100) {
//             id = `${idPrefix}00${count + 1}` + `/${year}`;
//           } else if (count < 1000) {
//             id = `${idPrefix}0${count + 1}` + `/${year}`;
//           } else {
//             id = `${idPrefix}${count + 1}` + `/${year}`;
//           }

//           // Insert the student into the database
//           await Student.create({ ...student, id });
//           ///////////////////////////////////////////////////////////////////////
//           try {
//             const response: any = await fetch(
//               "http://localhost:5000/auth/register",
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   email: student.email,
//                   role: ["student"],
//                   id: id,
//                 }),
//               }
//             );

//             if (response.status === 201) {
//               ////////////////////////////////////////////////////

//               /////////////////////////////////////////////////
//               const r = await response.json();
//               console.log("created student auth profile");
//               // const newStudent = await new Student({...data,id:id});
//               // await newStudent.save()
//               //  return res.status(201).json({ message: "successfully created student profile" });
//             } else {
//               const r = await response.json();

//               console.log(r.message);
//               //return res.status(400).json({ message: "An error happend please try again" });
//               console.log("unable to create student auth profile");
//             }
//           } catch (error: any) {
//             console.log(error.message);

//             //return res.status(500).json({ message: error.message });
//             console.log("unable to create student auth profile");
//           }

//           ////////////////////////////////////////////////////////////////////

//           count++; // Increment the count for the next student
//         }

//         console.log("Data inserted successfully");
//         res.status(200).json({ message: "Data inserted successfully" });
//         console.log("emails", emails);
//       } catch (error: any) {
//         console.error("Error inserting data:", error);
//         res.status(500).json({ message: error.message });
//       }
//     })
//     .on("error", (error: any) => {
//       // Handle any errors that occur during the parsing
//       console.error(error);
//       res.status(500).json({ message: error.message });
//     });
// };

// function validateStudent(student: any) {
//     const schema = Joi.object({
//       email: Joi.string().email(),
//       name: Joi.string().regex(/^[A-Za-z\s]+$/),
//       //birthday: Joi.date().format('YYYY-MM-DD'),
//      // phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Phone number must start with "+" and be followed by 12 digits'),
//       gender: Joi.string().valid('MALE', 'FEMALE'),
//       department_id: Joi.string().optional(),
//       status_id: Joi.string().optional(),
//       year: Joi.number().integer(),
//       //admission_date: Joi.date().format('YYYY-MM-DD').withMessage('Admission date must be in the format YYYY-MM-DD'),
//       //grad_date: Joi.date().format('YYYY-MM-DD').withMessage('Graduation date must be in the format YYYY-MM-DD'),
//       contact: Joi.string(),
//       address: Joi.string(),
//       emergencycontact_name: Joi.string().regex(/^[A-Za-z\s]+$/),
//       emergencycontact_relation: Joi.string(),
//       phone:Joi.string(),
//       birthday: Joi.date(),
//       admission_date: Joi.date(),
//       grad_date:Joi.date(),
//       //emergencycontact_phone: Joi.string().regex(/^\+\d{12}$/).withMessage('Emergency contact phone number must start with "+" and be followed by 12 digits'),
//       emergencycontact_phone: Joi.string()

//     });

//     return schema.validate(student);
//   }
