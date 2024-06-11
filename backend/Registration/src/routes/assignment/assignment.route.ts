import express from "express";
import {
  createSchedule,
  deleteAssignment,
  getAssignmentById,
  getAssignmentByInstId,
  getAssignmentBycourse,
  updateAssignment,
  getTeachersAssignment,
  getAssignmentHistory,
  getDataForInstructor,
} from "./assignment.controller";

const Assignmentrouter = express.Router();

Assignmentrouter.post("/register", createSchedule);
Assignmentrouter.get("/history", getAssignmentHistory);

Assignmentrouter.get("/course", getAssignmentBycourse);
Assignmentrouter.post("/teacher", getTeachersAssignment);
Assignmentrouter.get("/:id", getAssignmentById);

Assignmentrouter.get("/instructorData/:id", getDataForInstructor);

Assignmentrouter.get("/instructor/:id", getAssignmentByInstId);
Assignmentrouter.patch("/:id", updateAssignment);
Assignmentrouter.delete("/:id", deleteAssignment);

module.exports = Assignmentrouter;
