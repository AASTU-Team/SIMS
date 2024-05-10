import { Request, Response } from "express";
import mongoose from "mongoose";

const Staff = require("../../models/staff.model")
const Assignment = require("../../models/Assignment.model")


export const getFacultyProfile = async (req: Request, res: Response) => {
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
      const student = await Staff.findOne({
        email,
      });
      return res.status(200).json({
        student: student,

        role: role,
      });
    } else {
      return res.status(401).json({ message: "unAuthorized" });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getFacultyCourses = async (req: Request, res: Response) => {

  const faculty_id = req.body.faculty_id
  const courses:String[] = []

  try {
    const assignment:any[] = await Assignment.find({instructor_id:faculty_id})

    if(!assignment) {
      return res.status(404).json({ message: "Courses not found" });

    }

    assignment.map(assignment=>{
      courses.push(assignment.course_id)
    })

    return res.status(200).json({
      courses:courses
    });


    
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
    
  }




}

export const getFacultySchedule = async (req: Request, res: Response) => {

  const faculty_id = req.body.faculty_id


  try {
    const assignment:any[] = await Assignment.find({instructor_id:faculty_id})

    if(!assignment) {
      return res.status(404).json({ message: "data not found" });

    }

  
    return res.status(200).json(assignment);


    
  } catch (error:any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
    
  }




}
