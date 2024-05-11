import { Request, Response } from "express";
import mongoose, { Document, Schema, Types } from "mongoose";
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



export const createSchedule = async (req: Request, res: Response) => {
  const assignments = req.body.data;

  const { error } = Joi.array().items(assignmentSchema).validate(req.body.data);

  if (error) {
    // Handle validation error
    console.error(error);
    // Return an appropriate response indicating validation failure
    return res.status(400).json({ error: "Invalid request body" });
  }
  try {
    const newschedule = await Assignment.create(assignments);

if (!newschedule) {
  return res.status(400).json({ error: 'an error happened' });
}
  return res.status(201).json({"message":"created successfully"})
  
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'an error happened' });
  
}
   
   
 
 }

export const getAssignmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    return res.json(assignment);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};
export const updateAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignment = req.body;
  try {
    const conflict = await checkConflict(assignment, id);
    console.log(conflict);
    if (conflict) {
      return res.status(400).json(conflict);
    }
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      assignment,
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.json(updatedAssignment);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};
export const deleteAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.status(204).send({ message: "Assignment deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};
export const getAssignmentBySecId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.find({ section_id: id });
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    return res.json(assignment);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export const checkConflict = async (assignment: any, id: any) => {
  const assignmentData = await Assignment.findById(id);
  let iConflict;
  let rConflict;
  if (assignment.start_time) {
    if (assignment.instructor_id) {
      iConflict = await instructorConflict(
        assignment.instructor_id,
        assignment.start_time
      );
    }
    if (assignment.room_number) {
      rConflict = await roomConflict(
        assignment.room_number,
        assignment.start_time
      );
    }
    if (rConflict || iConflict) {
      return { error: "Conflict", rConflict, iConflict };
    } else {
      return false;
    }
  } else {
    if (assignment.instructor_id) {
      iConflict = await instructorConflict(
        assignment.instructor_id,
        assignmentData.start_time
      );
    }
    if (assignment.room_number) {
      rConflict = await roomConflict(
        assignment.room_number,
        assignmentData.start_time
      );
    }
    console.log(rConflict, iConflict);
    if (rConflict || iConflict) {
      return { error: "Conflict", rConflict, iConflict };
    } else {
      return false;
    }
  }
};
async function instructorConflict(instructor_id: any, start_time: any) {
  const conflict = await Assignment.find({
    $and: [{ instructor_id: instructor_id }, { start_time: start_time }],
  });
  if (conflict.length > 0) {
    return { error: "Conflict on instructor", conflict };
  } else {
    return false;
  }
}
async function roomConflict(room_id: any, start_time: any) {
  const conflict = await Assignment.find({
    $and: [{ room_number: room_id }, { start_time: start_time }],
  });
  if (conflict.length > 0) {
    return { error: "Conflict on room", conflict };
  } else {
    return false;
  }
}
