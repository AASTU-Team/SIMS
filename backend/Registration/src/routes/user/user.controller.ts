import { Request, Response } from "express";
import * as path from 'path';
import mongoose from "mongoose";
const fs = require('fs');
const csv = require('csv-parser');

import { handleSingleUploadFile } from '../../utils/uploadSingle';
import { User, UserInput } from '../../models/user.model';

export type UploadedFile = {
  fieldname: string; 
  originalname: string; 
  encoding: string; 
  mimetype: string; 
  destination: string; 
  filename: string; 
  path: string; 
  size: number; 
};

let results: any = [];

const Student = require('../../models/student.model');
const Staff = require('../../models/staff.model');
const Status = require('../../models/status.model');
const Department = require('../../models/department.model');
const Course = require('../../models/course.model');
const Curriculum = require('../../models/curriculum.model');
const Assignment = require('../../models/Assignment.model');

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentImage = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ Stud_Id : req.params.id });
    if (student && student.Stud_Image) {
      const imagePath = path.join(__dirname, '../../../public/uploads', student.Stud_Image);
      console.log(`Sending file: ${imagePath}`);
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results: any = [];

  const file: any = req.file

  
  // Process the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
      // Remove the temporary file
      fs.unlinkSync(file.path);

      // Do something with the parsed CSV data
      console.log(results);

      // Return a response
      res.json({ message: 'File uploaded and processed successfully' });
    })
    .on('error', (error: any) => {
      // Handle any errors
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });



};


export const registerStaff = (req: Request, res: Response) => {
  // Handle student registration logic here


  try {
    const data = req.body;


    const newStaff = new Staff(data);
    newStaff.save()

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
    newValue.save()


    res.status(200).json({ message: data });

  } catch (error: any) {

    res.status(500).json({ message: error.message });

  }
};


export const  registerStudent = async (req: Request, res: Response) => {
  // Handle student registration logic here

  try {
    let uploadResult;

    try {
      uploadResult = await handleSingleUploadFile('Stud_Image', req, res);
    } catch (e: any) {
      return res.status(422).json({ errors: [e.message] });
    }

    const uploadedFile: UploadedFile = uploadResult.file;
    console.log(uploadResult);
    
    const { body } = uploadResult;
    let data = req.body;
    data.Stud_Image = uploadResult.file.filename;
    // Add the uploaded file name to the data object

    const student = await Student.findOne({ Stud_Id : data.Stud_Id });

    if (student) {
      res.status(400).json({ message: student.Stud_Name });
      return;
    }

    const newStudent = await new Student(data);
    await newStudent.save()

    /*    const newStatus = await new Status({status:"Active"})
       await newStatus.save() */

    res.status(200).json({ message: data });

  } catch (error: any) {

    res.status(500).json({ message: error.message });

  }
};

export const registerStudentCsv = async (req: Request, res: Response) => {

  fs.createReadStream('./students.csv')
    .pipe(csv())
    .on('data', (data: any) => {
      // Process each row of data
      results.push(data);
    })
    .on('end', () => {
      // The parsing is complete
      console.log(results);

      Student.create(results)
        .then(() => {
          console.log('Data inserted successfully');
          res.status(200).json({ message: "Data inserted successfully" });
        })
        .catch((error: any) => {
          console.error('Error inserting data:', error);
          res.status(500).json({ message: error.message });
        });
      results = []
    })
    .on('error', (error: any) => {
      // Handle any errors that occur during the parsing
      console.error(error);
    });

};