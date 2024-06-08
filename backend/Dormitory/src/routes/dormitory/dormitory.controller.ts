import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

const Dormroom = require("../../models/dormroom.model");
const Dormassignment = require("../../models/dormassignment");
const Student = require("../../models/student.model");

export const assignRooms = async (req:Request, res:Response) => {
  try {
    // Fetch all active students grouped by year, department, and gender
    const studentsGroups = await Student.aggregate([
      {
        $match: { status: 'Active' },
      },
      {
        $group: {
          _id: {
            year: '$year',
            department_id: '$department_id',
            gender: '$gender',
          },
          students: {
            $push: {
              _id: '$_id',
              name: '$name',
            },
          },
        },
      },
    ]);
    console.log('Students groups:', studentsGroups);

    for (const group of studentsGroups) {
      const { year, department_id, gender } = group._id;
      const studentList = group.students;

      // Fetch available dorm rooms
      let availableDorms = await Dormroom.find({ capacity: { $gt: 0 } });

      for (const student of studentList) {
        if (availableDorms.length === 0) {
          console.log('No available dorm rooms left');
          break;
        }

        const dorm = availableDorms[0];

        // Assign student to dorm room
        const dormAssignment = new Dormassignment({
          room_id: dorm._id,
          student_id: student._id,
          assignment_date: new Date(),
        });

        await dormAssignment.save();

        // Decrement the room capacity
        dorm.capacity -= 1;
        await dorm.save();

        // Remove dorm from the available list if it's full
        if (dorm.capacity === 0) {
          availableDorms.shift();
        }

        console.log(`Assigned student ${student.name} to dorm room ${dorm.room_number}`);
      }
    }
  } catch (err) {
    console.error('Error during assignment:', err);
  }



}

export const createRooms = async (req:Request, res:Response) => {
  const { block, rooms, start_with,capaciy } = req.body;

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
        capaciy:capaciy
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