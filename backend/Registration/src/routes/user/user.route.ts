import express from "express";

import {
  addCourse,
  getTemplate,
  dropCourse,
  registerStudent,
  WithdrawalRequest,
  addDropCourse,
  acceptReject,
  getAddDrop,
  getStaffByDepId,
  getNumberOfStudents,
  acceptRejectRegistrar,
} from "./user.controller";
import { registerStaff } from "./user.controller";
import { registerDependency } from "./user.controller";
import { registerStudentCsv } from "./user.controller";
import { uploadFile } from "./user.controller";
import { getStudentProfile } from "./user.controller";
import { getAllStaff } from "./user.controller";
import { getstudentRegistrationCourses } from "./user.controller";
import { getDepartmentRegistrationStatus } from "./user.controller";
import { confirmDepartmentRegistration } from "./user.controller";
import { rejectDepartmentRegistration } from "./user.controller";
import { getRegistrarRegistrationStatus } from "./user.controller";
import { confirmRegistrarRegistration } from "./user.controller";
import { rejectRegistrarRegistration } from "./user.controller";


import { getAllStudent } from "./user.controller";
import { getStudentByDepartment } from "./user.controller";
import { deleteStudent } from "./user.controller";
import { updateStudent } from "./user.controller";
import { getStudentCourses } from "./user.controller";
import { studentRegistration } from "./user.controller";
import { ListAddCourses } from "./user.controller";
import { Request, Response } from "express";
import { getWithdrawalStatus } from "./user.controller";
import { getDepartmentWithdrawalRequests } from "./user.controller";
import { getRegistrarWithdrawalRequests } from "./user.controller";
import { AcceptDepartmentWithdrawalRequest } from "./user.controller";
import { AcceptRegistrarWithdrawalRequest } from "./user.controller";
import { RejectDepartmentWithdrawalRequest } from "./user.controller";
import { RejectRegistrarWithdrawalRequest } from "./user.controller";

import { AcceptWithdrawalRequest } from "./user.controller";
import { activateStudent } from "./user.controller";
import { deactivateUser } from "./user.controller";
import { deleteStaff } from "./user.controller";
import { updateStaff } from "./user.controller";
import { getStaffByDepartment } from "./user.controller";
import { exportAllStudent, exportAllStaff } from "./user.controller";

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
Studentrouter.get("/student/all/export", exportAllStudent);

Studentrouter.get("/staff/dept/:id", getStaffByDepId);

Studentrouter.get("/staff/all", getAllStaff);
Studentrouter.get("/staff/all/export", exportAllStaff);
Studentrouter.get("/student/department", getStudentByDepartment);
Studentrouter.get("/staff/department", getStaffByDepartment);
Studentrouter.delete("/student/delete", deleteStudent);
Studentrouter.delete("/staff/delete", deleteStaff);
Studentrouter.patch("/deactivate", deactivateUser);
Studentrouter.patch("/student/update", updateStudent);
Studentrouter.patch("/staff/update", updateStaff);

Studentrouter.get("/student/courses/:student_id", getStudentCourses);
Studentrouter.post("/student/register", studentRegistration);
Studentrouter.get(
  "/student/registrationCourses",
  getstudentRegistrationCourses
);
Studentrouter.get("/student/addcourses/:student_id", ListAddCourses);

// Studentrouter.post("/student/dropcourse/:id", dropCourse);
// Studentrouter.post("/student/addcourse/:id", addCourse);
Studentrouter.post("/student/addDrop/:student_id", addDropCourse);
Studentrouter.post("/student/stausUpdate", acceptReject);
Studentrouter.post("/student/stausUpdateRegistrar", acceptRejectRegistrar);
Studentrouter.get("/student/addDrop", getAddDrop);

Studentrouter.post("/student/withdrawalRequest", WithdrawalRequest);
Studentrouter.get("/student/withdrawalStatus",getWithdrawalStatus);
Studentrouter.get("/department/withdrawalRequests", getDepartmentWithdrawalRequests);
Studentrouter.get("/registrar/withdrawalRequests", getRegistrarWithdrawalRequests);

Studentrouter.post("/department/AcceptwithdrawalRequests", AcceptDepartmentWithdrawalRequest);
Studentrouter.post("/registrar/AcceptwithdrawalRequests",AcceptRegistrarWithdrawalRequest);

Studentrouter.post("/department/RejectwithdrawalRequests", RejectDepartmentWithdrawalRequest);
Studentrouter.post("/registrar/RejectwithdrawalRequests",RejectRegistrarWithdrawalRequest);



Studentrouter.post("/students/activateStudent", activateStudent);

Studentrouter.get("/department/getStudentStatus", getDepartmentRegistrationStatus);
Studentrouter.post("/department/confirmStudentStatus", confirmDepartmentRegistration);
Studentrouter.post("/department/rejectStudentStatus", rejectDepartmentRegistration);

Studentrouter.get("/registrar/getStudentStatus", getRegistrarRegistrationStatus);
Studentrouter.post("/registrar/confirmStudentStatus", confirmRegistrarRegistration);
Studentrouter.post("/registrar/rejectStudentStatus", rejectRegistrarRegistration);

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

Studentrouter.get("/student/numberofstudent/:course_id", getNumberOfStudents);

module.exports = Studentrouter;
