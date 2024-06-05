import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const AddStatus = require("../../models/AddStatus.model");





export const getAddStatus = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const status: any = await AddStatus.find()
  
     

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
    const status: any = await AddStatus.findById({ _id: id });
    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const createAddStatus = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newStatus = await new AddStatus(data);
    await newStatus.save();
    return res.status(201).json({ message: "success", staus: newStatus });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const ActivateAddStatus = async (req: Request, res: Response) => {
  const id = req.body.id;

  try {

    const RegStatus = await AddStatus.findOne({  semester:id})

    if(RegStatus)
      {
        RegStatus.status = "Active"
        await RegStatus.save()
        return res.status(200).json({ message: "success", staus: RegStatus });

      }

      else{
 
        return res.status(400).json({ message: "unable to find" });

      }



  
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
export const DeactivateAddStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
 
  try {

    const RegStatus = await AddStatus.findOne({  semester:id})

    if(RegStatus)
      {
        RegStatus.status ="Inactive"
        await RegStatus.save()
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
    const updates = await AddStatus.findByIdAndUpdate(id, requestData, {
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
    const deletedStatus = await AddStatus.findByIdAndDelete(id);
    if (!deletedStatus) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
