import express from "express";
import {
  createSchedule,
  deleteAssignment,
  getAssignmentById,
  getAssignmentByInstId,
  getAssignmentBySecId,
  updateAssignment,
} from "./assignment.controller";

const Assignmentrouter = express.Router();

Assignmentrouter.post("/register", createSchedule);
Assignmentrouter.get("/:id", getAssignmentById);
Assignmentrouter.get("/section/:id", getAssignmentBySecId);
Assignmentrouter.get("/instructor/:id", getAssignmentByInstId);
Assignmentrouter.patch("/:id", updateAssignment);
Assignmentrouter.delete("/:id", deleteAssignment);

module.exports = Assignmentrouter;
