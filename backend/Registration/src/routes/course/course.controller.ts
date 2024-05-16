import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const Course = require("../../models/course.model");
const Curriculum = require("../../models/curriculum.model");
const Department = require("../../models/department.model");
const Staff = require("../../models/staff.model");

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
export const createCourseCsv = async(req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }


  let errors:String[] = [""] 

  
  
     

  fs.createReadStream(req.file.path)
.pipe(csv())
.on('data', (data:any) => {
  // Process each row of data
  results.push(data);
})
.on('end', async() => {
  try {
    // The parsing is complete
    console.log(results);
    async function getEmailObjectIds(emails:any) {
      const staffIds = [];
      const emailList = emails.split(',');
      for (const email of emailList) {
        const staff = await Staff.findOne({ email: email.trim() });
        if (staff) {
          staffIds.push(staff._id);
        }
        else{
          errors.push("couldn't find staff" + " with email " + email)
        }
      }
      return staffIds;
    }
    
    async function getPrerequisiteObjectIds(prerequisites:any) {
      const courseIds = [];
      const prerequisiteList = prerequisites.split(',');
      for (const prerequisite of prerequisiteList) {
        const course = await Course.findOne({ code: prerequisite.trim() });
        if (course) {
          courseIds.push(course._id);
        }
        else{
          errors.push("couldn't find course" + " with code " + prerequisite)
        }
      }
      return courseIds;
    }

    async function getDeparmentId(name:any) {
   
    
        const id = await Department.findOne({name:name})
        if (id) {
          return id._id;
        }
        else{
          errors.push("couldn't find department" + " with name " + name)
        }
      
    
    }
    
    const transformedData = await Promise.all(results.map(async (item:any) => {
      const instructorIds = await getEmailObjectIds(item.instructors);
      const prerequisiteIds = await getPrerequisiteObjectIds(item.prerequisites);
      const departmentId = await getDeparmentId(item.department);
    
     const  course  = {
        name: item.name,
        department_id:departmentId ,
        instructors: instructorIds,
        credits: item.credits,
        prerequisites: prerequisiteIds,
        type: item.type,
        code: item.code,
        lec: item.lec,
        lab: item.lab,
        description: item.description
      };
      const validatedData = course;
    

      return validatedData;
    }
  ));

  
      await Course.create(transformedData);

    console.log('Data inserted successfully');
    res.status(200).json({ message: "successful",errors:errors });
  
  } catch (error:any) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: error.message });
  }
})
.on('error', (error:any) => {
  // Handle any errors that occur during the parsing
  console.error(error);
  res.status(500).json({ message: error.message });
});
  
};
function validateCourse(course: any) {
  const courseSchema = Joi.object({
    name: Joi.string().required(),
    department_id: Joi.string().required(),
    instructors: Joi.array().items(Joi.string().optional()),
    credits: Joi.number().required(),
    prerequisites: Joi.array().items(Joi.string().required()),
    type: Joi.string().required(),
    code: Joi.string().required(),
    lec: Joi.string().required(),
    lab: Joi.string().required(),
    description: Joi.string().optional(),
  });

  return courseSchema.validate(course);
}

export const getCourses = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const course: any = await Course.find();
    res.status(200).json({ data: course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getCourseById = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { id } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const course: any = await Course.findById({ _id: id });
    res.status(200).json({ data: course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCourseByCode = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { code } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const course: any = await Course.findOne({ code:code });
    res.status(200).json({ data: course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const createCourse = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newCourse = await new Course(data);
    await newCourse.save();
    return res.status(201).json({ message: "success", course: newCourse });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const requestData = req.body;
    const updates = await Course.findOneAndUpdate({code:code}, requestData, {
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
export const deleteCourse = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    const deletedCourse = await Course.findOneAndDelete({ code:code });
    if (!deletedCourse) {
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

// export const getStudentByDepartment = async(req: Request, res: Response) => {

//     const department  = req.body.department_id;

//     try {

//       const students:any = await Student.find({department_id:department});
//       res.status(200).json({ message: students });

//     } catch (error:any) {

//         return res.status(500).json({ message: error.message });

//     }
//   }

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
