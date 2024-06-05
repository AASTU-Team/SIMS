import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { registerStaff } from "routes/user/user.controller";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const Semester = require("../../models/Semesters.model");
const AddStatus = require("../../models/AddStatus.model");
const RegistrationStatus = require("../../models/RegistrationStatus.model");





export const getSemesters = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const status = await Semester.find().lean();
    const data:any = []

    for(const dep of status)
      {
        const reg = await RegistrationStatus.findOne({semester:dep._id})
        const add = await AddStatus.findOne({semester:dep._id})
       
        data.push({ ...dep, key: dep._id.toString(),addStatus:add.status,regStatus:reg.status })

      }

   

    // Add the 'key' property to each document
    //const data = status.map((doc:any) => ({ ...doc, key: doc._id.toString() }));

    res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveSemesters = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const status: any = await Semester.find({status:true})
  

    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSemesterById = async (req: Request, res: Response) => {
  // fetch dep id from the auth
  const { id } = req.params;
  try {
    // use find({dep_id : id from fetch })
    const status: any = await Semester.findById({ _id: id });
    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const createSemester = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newStatus = await new Semester(data);
    await newStatus.save();

    const addStatus = await new AddStatus({semester: newStatus._id, status:false});
    await addStatus.save();

    const registrationStatus = await new RegistrationStatus({semester: newStatus._id, status:false});
    await registrationStatus.save();

    return res.status(201).json({ message: "success", staus: newStatus });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const ActivateSemester= async (req: Request, res: Response) => {
  const id = req.body.id;
  
  try {

    const semesterStatus = await Semester.findById(id)

    if(semesterStatus)
      {
        semesterStatus.status = true
        await semesterStatus.save()
        return res.status(200).json({ message: "success", staus: semesterStatus });

      }

      else{
       
        return res.status(400).json({ message: "unable to find semester"});

      }



  
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const DeactivateSemesterStatus = async (req: Request, res: Response) => {
  const id= req.body.id;

  try {

    const semesterStatus = await Semester.findById(id)


    if(semesterStatus)
      {
        semesterStatus.status = false
        await semesterStatus.save()
        return res.status(200).json({ message: "success", staus: semesterStatus });

      }

      else{
   
        return res.status(400).json({ message: "unable to find Semester" });

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
    const updates = await Semester.findByIdAndUpdate(id, requestData, {
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
    const deletedStatus = await Semester.findByIdAndDelete(id);
    if (!deletedStatus) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
