import express from "express";
import {
  createSchedule,
  deleteAssignment,
  getAssignmentById,
  getAssignmentByInstId,
  getAssignmentBycourse,
  updateAssignment,
} from "./assignment.controller";

const Assignmentrouter = express.Router();

Assignmentrouter.post("/register", createSchedule);

Assignmentrouter.get("/course", getAssignmentBycourse);
Assignmentrouter.get("/:id", getAssignmentById);

Assignmentrouter.get("/instructor/:id", getAssignmentByInstId);
Assignmentrouter.patch("/:id", updateAssignment);
Assignmentrouter.delete("/:id", deleteAssignment);

module.exports = Assignmentrouter;
