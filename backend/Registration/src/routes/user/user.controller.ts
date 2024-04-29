import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");

let results: any = [];

const Student = require("../../models/student.model");
const Staff = require("../../models/staff.model");
const Status = require("../../models/status.model");
const Department = require("../../models/department.model");
const Course = require("../../models/course.model");
const Curriculum = require("../../models/curriculum.model");
const Assignment = require("../../models/Assignment.model");

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results: any = [];

  const file: any = req.file;

  // Process the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data: any) => results.push(data))
    .on("end", () => {
      // Remove the temporary file
      fs.unlinkSync(file.path);

      // Do something with the parsed CSV data
      console.log(results);

      // Return a response
      res.json({ message: "File uploaded and processed successfully" });
    })
    .on("error", (error: any) => {
      // Handle any errors
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const registerStaff = (req: Request, res: Response) => {
  // Handle student registration logic here
  try {
    const data = req.body;

    const newStaff = new Staff(data);
    newStaff.save();

    res.status(200).json({ message: data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerDependency = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const data = req.body;

    const newValue = new Assignment(data);
    newValue.save();

    res.status(200).json({ message: data });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerStudent = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    const data = req.body;

    /*    const student  = await Student.findOne({Stud_Name: data.Stud_Name});

        if(student)
            {
                res.status(400).json({ message: student.Stud_Name });
                return;
            }
 */

    /*    const newStatus = await new Status({status:"Active"})
        await newStatus.save() */

    try {
      const response: any = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: req.body.email,
        }),
      });

      if (response.status === 201) {
        const r = await response.json();
        console.log(r.message);
        const newStudent = await new Student(data);
        await newStudent.save();
        return res
          .status(201)
          .json({ message: "successfully created student profile" });
      } else {
        const r = await response.json();

        console.log(r.message);
        return res
          .status(400)
          .json({ message: "An error happend please try again" });
      }
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ message: error.message });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const registerStudentCsv = async (req: Request, res: Response) => {
  fs.createReadStream("./students.csv")
    .pipe(csv())
    .on("data", (data: any) => {
      // Process each row of data
      results.push(data);
    })
    .on("end", () => {
      // The parsing is complete
      console.log(results);

      Student.create(results)
        .then(() => {
          console.log("Data inserted successfully");
          res.status(200).json({ message: "Data inserted successfully" });
        })
        .catch((error: any) => {
          console.error("Error inserting data:", error);
          res.status(500).json({ message: error.message });
        });
      results = [];
    })
    .on("error", (error: any) => {
      // Handle any errors that occur during the parsing
      console.error(error);
    });
};

export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const response: any = await fetch("http://localhost:5000/auth/me", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.header("Authorization") as string,
      },
    });

    if (response.status === 200) {
      const { email, role } = await response.json();
      const student = await Student.findOne({
        email,
      });
      return res.status(200).json({ ...student, role });
    } else {
      return res.status(401).json({ message: "unAuthorized" });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
