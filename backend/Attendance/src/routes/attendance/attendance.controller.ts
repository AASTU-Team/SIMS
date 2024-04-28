import { Request, Response } from "express";
import mongoose from "mongoose";
const Course = require("../../models/course.model");
//const ATtendance = require('../../models/Attendance.model');

import Attendacne from "../../models/Attendance.model";

interface Attendance2 {
  student_id: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}
interface edit {
  attendance_id: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export const registerAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  //const course_id = data.course_id
  const course_name = data.course_name;
  const instructor_id = data.instructor_id;
  const date = data.date;
  const attendance: Attendance2[] = data.attendance;

  const course = await Course.findOne({ name: data.course_name });

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  const course_id = course._id.toString();

  const newArray = attendance.map((item) => {
    return {
      ...item,
      course_id: course_id,
      instructor_id: instructor_id,
      semester_id: 1,
      date: date,
    };
  });

  Attendacne.insertMany(newArray)
    .then((result: any) => {
      console.log("Inserted", result.length, "attendance records");
      res.status(200).json({ message: "Attendance registered successfully" });
    })
    .catch((error: any) => {
      console.error("Error inserting attendance records:", error);
      res.status(500).json({ message: "Error inserting attendance records" });
    });
};
export const getInstructorAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  const course_id = data.course_id;
  const instructor_id = data.instructor_id;

  const attendance = await Attendacne.find({
    course_id: course_id,
    instructor_id: instructor_id,
  });

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  res.status(200).json(attendance);
};

export const getAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  const course_id = data.course_id;
  // c
  const student_id = data.student_id;

  const attendance = await Attendacne.find({
    course_id: course_id,
    student_id: student_id,
  });

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  return res.status(200).json(attendance);
};

export const editAttendance = async (req: Request, res: Response) => {
  const attendance: edit[] = req.body.attendance;

  const ids = attendance.map((item) => item.attendance_id);
  const updates = attendance.map((item) => {
    const { attendance_id, ...rest } = item; // Destructure to exclude attendance_id
    return { _id: attendance_id, ...rest }; // Create new object with _id and rest
  });
  const attendanceResut = await Attendacne.updateMany(
    { _id: { $in: ids } },
    { $setOnInsert: updates }, // Update based on corresponding id in updates array
    { multi: true } // Allow updating multiple documents
  );
  if (!attendance) return res.status(400).send({ message: "not found" });
  res.send(200).send(attendance);
};
