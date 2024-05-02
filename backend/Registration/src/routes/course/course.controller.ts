import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

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
    const updates = await Course.findByIdAndUpdate(id, requestData, {
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
    const deletedCourse = await Course.findByIdAndDelete({ _id: id });
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
