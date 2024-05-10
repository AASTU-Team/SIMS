import { Request, Response } from "express";
import mongoose, { Document, Schema, Types } from 'mongoose';
import Joi from "joi";

interface AssignmentI {
  course_id?: Types.ObjectId;
  instructor_id?: Types.ObjectId;
  section_id?: Types.ObjectId;
  room_number?: Types.ObjectId;
  start_time?: string;
  end_time?: string;
  Lab_Lec?: string;
}
const assignmentSchema = Joi.object<AssignmentI>({
  course_id: Joi.string().optional(),
  instructor_id: Joi.string().optional(),
  section_id: Joi.string().optional(),
  room_number: Joi.string().optional(),
  start_time: Joi.string().optional(),
  end_time: Joi.string().optional(),
  Lab_Lec: Joi.string().optional(),
});




const Student = require("../../models/student.model");
const Staff = require("../../models/staff.model");
const Status = require("../../models/status.model");
const Department = require("../../models/department.model");
const Course = require("../../models/course.model");
const Curriculum = require("../../models/curriculum.model");
const Assignment = require("../../models/Assignment.model");
const Registration = require("../../models/registration.model");
const RegistrationStatus = require("../../models/RegistrationStatus.model");



export const createSchedule = async(req: Request, res: Response) => {

  const assignments = req.body.data

  const { error } = Joi.array().items(assignmentSchema).validate(req.body.data);

if (error) {
  // Handle validation error
  console.error(error);
  // Return an appropriate response indicating validation failure
  return res.status(400).json({ error: 'Invalid request body' });
}
try {
  
const newschedule = await Assignment.create(assignments)

if (!newschedule) {
  return res.status(400).json({ error: 'an error happened' });
}
  return res.status(201).json({"message":"created successfully"})
  
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'an error happened' });
  
}






}