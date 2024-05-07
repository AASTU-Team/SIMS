import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");
const checkPrerequisite= require("../../helper/checkPrerequisite")

let results: any = [];

const Department = require("../../models/department.model");
const Student = require("../../models/student.model");
const Registration = require("../../models/registration.model");
const Curriculum = require("../../models/curriculum.model");

const Course = require("../../models/course.model");
async function getCredit(Id: String): Promise<any> {

  const course = await Course.findById(Id);
  if (!course) {
    //console.error("Course not found");
    return 0;
  }
 // console.log(parseInt(course.credits));

  return parseInt(course.credits);

}


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

export const getDep = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const department: any = await Department.find();
    res.status(200).json({ data: department });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getDepById = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { id } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const department: any = await Department.findById({ _id: id });
    if (!department)
      return res.status(404).json({ message: "Department not found." });
    res.status(200).json({ data: department });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const createDep = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newDepartment = await new Department(data);
    await newDepartment.save();
    return res
      .status(201)
      .json({ message: "success", Department: newDepartment });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const updateDep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestData = req.body;
    const updates = await Department.findByIdAndUpdate(id, requestData, {
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
export const deleteDep = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedDepartment = await Department.findByIdAndDelete({ _id: id });
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

///assign deparmtent for students
export const assignDepartmentCsv = async (req: Request, res: Response) => {
  let errors: string[] = [""];

  const results: any[] = [];
  const total_credit: Number[] = [];

  fs.createReadStream("./department.csv")
    .pipe(csv())
    .on("data", async (data: any) => {
      // Process each row of data
      results.push(data);

      let department_id = "";
      let student_id = "";
      let semester = 1;
      const courses: any[] = [];

      if (data.semester) {
        semester = parseInt(data.semester);
      }

      console.log("Processing student:", data.id);

      const theStudent = await Student.findOne({ id: data.id });
      if (!theStudent) {
        errors.push(`Can't find student with id ${data.id}`);
        return;
      }

      const department = await Department.findOne({ name: data.department });
      if (!department) {
        errors.push(`Can't find department for student with id ${data.id}`);
        return;
      }

      department_id = department._id;
      student_id = theStudent._id;

      if (theStudent && department) {
        department_id = department._id;
        theStudent.department_id = department_id;
        await theStudent.save();
        console.log(`Student with id ${data.id} assigned to department ${data.department}`);
      }

      const curriculum = await Curriculum.findOne({
        department_id: department_id,
        year: data.year,
      });

      if (!curriculum) {
        errors.push(`Can't find curriculum for student with id ${data.id}`);
        return;
      }

      const departmentCourses: any[] = curriculum.courses;

      departmentCourses.forEach(async(course) => {
        if (course.semester === semester) {
          if(checkPrerequisite(course.courseId,student_id)){  ///validate here
            
         
          courses.push({
            courseID: course.courseId,
            grade: "",
            status: "Active",
            isRetake: false,
          });
          const value = await getCredit(course.courseId)
          total_credit.push(value); 

        }

        }
      });
      let sum:number = 0
      total_credit.map((credit:any) => {
        sum += credit;
      });

      const registration = new Registration({
        stud_id: student_id,
        year: data.year,
        semester: semester,
        courses: courses,
        registration_date: new Date(),
        total_credit:sum
      });

      try {
        const savedRegistration = await registration.save();
        console.log("Registration saved successfully:", savedRegistration);
      } catch (error) {
        console.error("Error saving registration:", error);
        errors.push(`Unable to save registration of student ${data.id}`);
      }
    })
    .on("end", () => {
      // Send the response after the parsing and processing is complete
      console.log("Total results:", results.length);
      res.status(200).json({ message: errors });
    })
    .on("error", (error: any) => {
      // Handle any errors that occur during the parsing
      console.error(error);
      res.status(500).json({ message: error.message });
    });
};
