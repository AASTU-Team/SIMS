import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const RegistrationStatus = require("../../models/RegistrationStatus.model");
const Notification = require("../../helper/Notification");
const Student = require("../../models/student.model");
const Semester = require("../../models/Semesters.model");





export const getRegistrationStatus = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const status: any = await RegistrationStatus.find()
    

    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getStatusById = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { id } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const status: any = await RegistrationStatus.findById({ _id: id });
    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const createRegistrationStatus = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newStatus = await new RegistrationStatus(data);
    await newStatus.save();
    return res.status(201).json({ message: "success", staus: newStatus });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const ActivateRegistrationStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
  const emails:any  = []

  try {

    const RegStatus = await RegistrationStatus.findOne({  semester:id})

    if(RegStatus)
      {
        RegStatus.status = "Active"
        await RegStatus.save()

        const Mysemester = await Semester.findById(id)
        const batches = Mysemester.batches

       

        const students = await Student.find()
        students.map((student:any) => {
          const y  = student.year
          const year = y.toString()
          const s = student.semester
          const semester = s.toString()

          if (batches.includes(year) && semester == Mysemester.semester) {
            emails.push(student.email)

          }
  

        })
        
        const data = {
          "data" : {
      "srecipient":emails,
      "message" : "Registration period is active",
      "type" : "RegistrationStatus"
     },
      "name" : "student" , 
     "dept_id" : "6627f1cb16bcc35f5d498f30"
          
          }
           await Notification(data)
          

        return res.status(200).json({ message: "success", staus: RegStatus });


      }

      else{
     
        return res.status(401).json({ message: "unable to update"});

      }



  
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const DeactivateRegistrationStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
  const emails:any = []

  try {

    const RegStatus = await RegistrationStatus.findOne({  semester:id})

    if(RegStatus)
      {
        RegStatus.status = "Inactive"
        await RegStatus.save()
        const Mysemester = await Semester.findById(id)
        const batches = Mysemester.batches

       

        const students = await Student.find()
        students.map((student:any) => {
          const y  = student.year
          const year = y.toString()
          const s = student.semester
          const semester = s.toString()

          if (batches.includes(year) && semester == Mysemester.semester) {
            emails.push(student.email)

          }
  

        })
        
        const data = {
          "data" : {
      "srecipient":emails,
      "message" : "Registration period is Inactive",
      "type" : "RegistrationStatus"
     },
      "name" : "student" , 
     "dept_id" : "6627f1cb16bcc35f5d498f30"
          
          }
          await Notification(data)
        return res.status(200).json({ message: "success", staus: RegStatus });

      }

      else{
   
        return res.status(400).json({ message: "unable to find registration status" });

      }



  
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestData = req.body;
    const updates = await RegistrationStatus.findByIdAndUpdate(id, requestData, {
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
export const deleteStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedStatus = await RegistrationStatus.findByIdAndDelete(id);
    if (!deletedStatus) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
