import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

const Dormroom = require("../../models/dormroom.model");
const Dormassignment = require("../../models/dormassignment");
const Student = require("../../models/student.model");

export const createRooms = async (req:Request, res:Response) => {
  const { block, rooms, start_with } = req.body;

  const schema = Joi.object({
    rooms: Joi.number().required(),
    block: Joi.string().required(),
    start_with: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const roomData = [];
    let x = start_with;
    for (let i = 0; i < rooms; i++) {
      roomData.push({
        room_number: x,
        block: block,
      });
      x++;
    }

    const createdRooms = await Dormroom.create(roomData);

    return res.status(200).json({ message: 'Rooms created successfully.', rooms: createdRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating rooms.' });
  }
};

export const assignDormitory = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  let errors: string[] = [];
  let success: string[] = [];
  let  count = 1

  const results: any[] = [];
  const total_credit: Number[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", async (data: any) => {
      // Process each row of data
      results.push(data);

      const student = await Student.findOne({id:data.id})
      if(!student)
        {
          errors.push(`Student with id ${data.id} does not exist. in line ${count}`)
          return
    
        }

      const dorm = await Dormroom.findOne({block:data.block,room_number:data.room_number})
      if(!dorm)
        {
          errors.push(`Dormitory with block ${data.block} and room number ${data.room_number} does not exist. in line ${count}`)
          return
        }

      try {
        const dormAssignment:any = await new Dormassignment(
          {
            room_id:dorm._id,
            student_id:student._id,
            assignment_date:new Date()
          }
        
        )
       const status =  await dormAssignment.save()

       if(status)
        {
          console.log("success")
          success.push(`Student with id ${data.id} assigned to dormitory with block ${data.block} and room number ${data.room_number} in line ${count}`)
        }
        else{
          errors.push(`can't assign dorm for srudent in line ${count}`)
        }

        
      } catch (error) {
        console.error(error);
        errors.push(`can't assign dorm for srudent in line ${count}`)
        
      }

     







     
    })
    .on("end", () => {
      // Send the response after the parsing and processing is complete
      console.log("Total results:", results.length);
      if(success.length > 0) {
        res.status(200).json({ errors: errors,message:"successfully assigned dormitory" });

      }
      else
      {
        res.status(400).json({ message: errors });
        
      }
    
    })
    .on("error", (error: any) => {
      // Handle any errors that occur during the parsing
      console.error(error);
      res.status(500).json({ message: error.message });
    });


  


}