import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");
import path from "path";


const https = require('https'); 


const Json2csvParser = require("json2csv").Parser;

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
export const createCourseCsv = async (req: Request, res: Response) => {
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
        async function getEmailObjectIds(emails: any) {
          const staffIds = [];
          const emailList = emails.split(",");
          for (const email of emailList) {
            const staff = await Staff.findOne({ email: email.trim() });
            if (staff) {
              staffIds.push(staff._id);
            } else {
              errors.push("couldn't find staff" + " with email " + email);
            }
          }
          return staffIds;
        }

        async function getPrerequisiteObjectIds(prerequisites: any) {
          const courseIds = [];
          const prerequisiteList = prerequisites.split(",");
          for (const prerequisite of prerequisiteList) {
            const course = await Course.findOne({ code: prerequisite.trim() });
            if (course) {
              courseIds.push(course._id);
            } else {
              errors.push(
                "couldn't find course" + " with code " + prerequisite
              );
            }
          }
          return courseIds;
        }

        async function getDeparmentId(name: any) {
          const id = await Department.findOne({ name: name });
          if (id) {
            return id._id;
          } else {
            errors.push("couldn't find department" + " with name " + name);
          }
        }

        const transformedData = await Promise.all(
          results.map(async (item: any) => {
            const instructorIds = await getEmailObjectIds(item.instructors);
            const prerequisiteIds = await getPrerequisiteObjectIds(
              item.prerequisites
            );
            const departmentId = await getDeparmentId(item.department);

            const course = {
              name: item.name,
              department_id: departmentId,
              instructors: instructorIds,
              credits: item.credits,
              prerequisites: prerequisiteIds,
              type: item.type,
              code: item.code,
              lec: item.lec,
              lab: item.lab,
              description: item.description,
            };
            const validatedData = course;

            return validatedData;
          })
        );

        await Course.create(transformedData);

        console.log("Data inserted successfully");
        res.status(200).json({ message: "successful", errors: errors });
      } catch (error: any) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: error.message });
      }
    })
    .on("error", (error: any) => {
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
    const courses: any = await Course.find()
      .populate({
        path: "prerequisites",
        select: "name code",
      })
      .populate({
        path: "instructors",
        select: "name email",
      }).populate("department_id");;
    
    const courseView = courses.map((course: any) => {
      return {
        ...course.toObject(),
        department_name: course.department_id?.name,
      };
    });

    res.status(200).json({ data: courseView });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportCourses = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const courses: any = await Course.find()
      .populate({
        path: "prerequisites",
        select: "name code",
      })
      .populate({
        path: "instructors",
        select: "name email",
      }).populate("department_id");;
    
    const courseView = courses.map((course: any) => {
      return {
        ...course.toObject(),
        department_name: course.department_id?.name,
      };
    });
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(courseView);
    const filePath = path.join("./exports", "courses.csv");
    
    fs.writeFile(filePath, csvData, function (error: any) {
      if (error) throw error;
      console.log("Write to csv was successfull!");
    });
    
    // Read the CSV file contents
    fs.readFile(filePath, (err:any, data:any) => {
      if (err) {
        console.error("Error reading CSV file:", err);
        res.status(500).json({ error: "Error exporting data" });
        return;
      }
    
      // Create a Blob object from the CSV data
      const blob = new Blob([data], { type: "text/csv" });
    
      // Set the necessary headers to trigger a download
      res.setHeader("Content-Disposition", "attachment; filename=students.csv");
      res.setHeader("Content-Type", "text/csv");
      const file = path.join(
      __dirname,
      "..",
      "..",
      "..",

      "exports",
      "courses.csv"
    );
    console.log(__dirname);
    res.download(file);
    
      // Send the Blob in the response
      // res.status(200).send({data:blob});
    });;

    // console.log(myStudents);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* export const exportCourses = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const courses: any = await Course.find()
      .populate({
        path: "prerequisites",
        select: "name code",
      })
      .populate({
        path: "instructors",
        select: "name email",
      }).populate("department_id");;
    
    const courseView = courses.map((course: any) => {
      return {
        ...course.toObject(),
        department_name: course.department_id?.name,
      };
    });

    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(courseView);
    const filePath = path.join('./exports', 'courses.csv');

        fs.writeFile(filePath, csvData, function(error:any) {
          if (error) throw error;
          console.log("Write to csv was successfull!");
       
        });
// Get the path to the CSV file on the server
const csvFilePath = path.join( './exports', 'courses.csv');

// Set the path to the downloads folder
const downloadsPath = path.join(require('os').homedir(), 'Downloads', 'courses.csv');

// Create a read stream for the CSV file
const readStream = fs.createReadStream(csvFilePath);

// Create a write stream to the downloads folder
const writeStream = fs.createWriteStream(downloadsPath);

// Pipe the read stream to the write stream
readStream.pipe(writeStream);

// Set the necessary headers to trigger a download
await writeStream.on('open', () => {
  res.setHeader('Content-Disposition', 'attachment; filename=courses.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).json({ message: "successfully exported" });
});
      
    console.log('Data exported to courses.csv');
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}; */
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
    const course: any = await Course.findOne({ code: code });
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
    const { id } = req.params;
    const requestData = req.body;
    const updates = await Course.findById(id, requestData, {
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
  const { id } = req.params;

  try {
    // Find the course to ensure it exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update other courses to remove this course from their prerequisites
    await Course.updateMany(
      { prerequisites: id },
      { $pull: { prerequisites: id } }
    );

    // Delete the course
    await Course.findByIdAndDelete(id);

    return res.status(200).json({ message: "Course and its prerequisite references removed successfully." });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};
