import express from "express";

import {
  addCourse,
  getTemplate,
  dropCourse,
  registerStudent,
  WithdrawalRequest,
} from "./user.controller";
import { registerStaff } from "./user.controller";
import { registerDependency } from "./user.controller";
import { registerStudentCsv } from "./user.controller";
import { uploadFile } from "./user.controller";
import { getStudentProfile } from "./user.controller";
import { getAllStaff } from "./user.controller";

import { getAllStudent } from "./user.controller";
import { getStudentByDepartment } from "./user.controller";
import { deleteStudent } from "./user.controller";
import { updateStudent } from "./user.controller";
import { getStudentCourses } from "./user.controller";
import { studentRegistration } from "./user.controller";
import { ListAddCourses } from "./user.controller";
import { Request, Response } from "express";
import { getWithdrawalRequests } from "./user.controller";
import { AcceptWithdrawalRequest } from "./user.controller";
import { activateStudent } from "./user.controller";

const assignSection = require("../../helper/assignSection");

// const assignSection = require("../../helper/assignFreshmanCourse");

const validateRegistration = require("../../middlware/validateRegistration");
const validateSRegistration = require("../../middlware/validateSRegistration");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const Studentrouter = express.Router();

// Register a student

Studentrouter.post("/register/student", validateRegistration, registerStudent);
Studentrouter.post(
  "/register/studentCsv",
  upload.single("file"),
  registerStudentCsv
);
Studentrouter.post("/register/staff", validateSRegistration, registerStaff);
Studentrouter.post("/register/add", registerDependency);
Studentrouter.post("/me", getStudentProfile);

Studentrouter.post("/upload", upload.single("file"), uploadFile);
Studentrouter.get("/student/all", getAllStudent);
Studentrouter.get("/staff/all", getAllStaff);
Studentrouter.get("/student/department", getStudentByDepartment);
Studentrouter.delete("/student/delete", deleteStudent);
Studentrouter.patch("/student/update", updateStudent);

Studentrouter.get("/student/courses", getStudentCourses);
Studentrouter.post("/student/register", studentRegistration);
Studentrouter.get("/student/addcourses", ListAddCourses);

Studentrouter.post("/student/dropcourse/:id", dropCourse);
Studentrouter.post("/student/addcourse/:id", addCourse);

Studentrouter.post("/student/withdrawalRequest", WithdrawalRequest);
Studentrouter.get("/students/withdrawalRequests", getWithdrawalRequests);
Studentrouter.post(
  "/students/acceptWithdrawalRequests",
  AcceptWithdrawalRequest
);
Studentrouter.post("/students/activateStudent", activateStudent);

Studentrouter.get("/template", getTemplate);

Studentrouter.post("/student/test", async (req: Request, res: Response) => {
  const { department, year, semester, max } = req.body;
  const a = await assignSection({
    department,
    year,
    semester,
    max,
  });
  if (a.success) {
    res.status(200).json(a);
  } else {
    res.status(400).json(a);
  }
});

module.exports = Studentrouter;
