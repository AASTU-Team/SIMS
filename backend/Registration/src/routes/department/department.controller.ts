import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const Department = require("../../models/department.model");

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
export const assignDepartmentCsv = async(req: Request, res: Response) => {


  let errors:String[] = [""] 

  
  
     

  fs.createReadStream('./department.csv')
.pipe(csv())
.on('data', (data:any) => {
  // Process each row of data
  results.push(data);
})
.on('end', async() => {
  try {
    // The parsing is complete
    console.log(results);
    
  
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
