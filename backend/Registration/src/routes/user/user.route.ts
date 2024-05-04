import express from "express";

import { addCourse, dropCourse, registerStudent } from "./user.controller";
import { registerStaff } from "./user.controller";
import { registerDependency } from "./user.controller";
import { registerStudentCsv } from "./user.controller";
import { uploadFile } from "./user.controller";
import { getStudentProfile } from "./user.controller";

import { getAllStudent } from "./user.controller";
import { getStudentByDepartment } from "./user.controller";
import { deleteStudent } from "./user.controller";
import { updateStudent } from "./user.controller";
import { getStudentCourses } from "./user.controller";
import { studentRegistration } from "./user.controller";
import { Request, Response } from "express";

// import { assignSection } from "../../helper/assignFreshmanCourse";

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
Studentrouter.post("/register/studentCsv", registerStudentCsv);
Studentrouter.post("/register/staff", validateSRegistration, registerStaff);
Studentrouter.post("/register/add", registerDependency);
Studentrouter.post("/me", getStudentProfile);

Studentrouter.post("/upload", upload.single("file"), uploadFile);
Studentrouter.get("/student/all", getAllStudent);
Studentrouter.get("/student/department", getStudentByDepartment);
Studentrouter.delete("/student/delete", deleteStudent);
Studentrouter.patch("/student/update", updateStudent);

Studentrouter.get("/student/courses", getStudentCourses);
Studentrouter.post("/student/register", studentRegistration);

Studentrouter.post("/student/dropcourse/:id", dropCourse);
Studentrouter.post("/student/addcourse/:id", addCourse);

Studentrouter.get("/student/test", async (req: Request, res: Response) => {
  //   const a = await assignSection({
  //     department: "freshman",
  //     year: 1,
  //     semester: 1,
  //   });
  //   console.log(a);
});

module.exports = Studentrouter;
