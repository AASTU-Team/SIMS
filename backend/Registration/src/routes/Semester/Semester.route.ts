import express from "express";

import { getSemesters } from "./Semester.controller";
import { getActiveSemesters } from "./Semester.controller";
import { getSemesterById } from "./Semester.controller";
import { createSemester } from "./Semester.controller";
import { ActivateSemester } from "./Semester.controller";
import { DeactivateSemesterStatus } from "./Semester.controller";
import { updateStatus } from "./Semester.controller";
import { deleteStatus } from "./Semester.controller";





const Semesterrouter = express.Router();

// get RegistrationStatus based on dept
Semesterrouter.get("/", getSemesters);
Semesterrouter.get("/activeSemesters", getActiveSemesters);
Semesterrouter.get("/:id", getSemesterById);
Semesterrouter.post("/create", createSemester);
Semesterrouter.post("/activate", ActivateSemester);
Semesterrouter.patch("/deactivate", DeactivateSemesterStatus);

Semesterrouter.patch("/:id", updateStatus);
Semesterrouter.delete("/:id", deleteStatus); 

module.exports = Semesterrouter;
