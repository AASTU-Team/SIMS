import express from "express";
const accessAuth = require("../../middlware/role/auth")
const studentAuth = require('../../middlware/role/student.middleware')

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
  getActiveAddDrop,
} from "./user.controller";
import { registerStaff } from "./user.controller";
import { registerDependency } from "./user.controller";
import { registerStudentCsv } from "./user.controller";
import { uploadFile } from "./user.controller";
import { getStudentProfile } from "./user.controller";
import { getAllStaff } from "./user.controller";
import { getStudentRegistrationHistory } from "./user.controller";
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
import { getStudentCourseStatus } from "./user.controller";
import { getStudentSemesters } from "./user.controller";
import { studentRegistration } from "./user.controller";
import { ListAddCourses } from "./user.controller";
import { Request, Response } from "express";
import { getWithdrawalStatus } from "./user.controller";
import { exportWithdrawalFile } from "./user.controller";
import { exportEnrollmentFile } from "./user.controller";
import { EnrollmentRequest } from "./user.controller";
import { getDepartmentWithdrawalRequests } from "./user.controller";
import { getDepartmentEnrollmentRequests } from "./user.controller";
import { getRegistrarWithdrawalRequests } from "./user.controller";
import { getRegistrarEnrollmentRequests } from "./user.controller";
import { AcceptDepartmentWithdrawalRequest } from "./user.controller";
import { AcceptDepartmentEnrollmentRequest } from "./user.controller";
import { AcceptRegistrarWithdrawalRequest } from "./user.controller";
import { AcceptRegistrarEnrollmentRequest } from "./user.controller";
import { RejectRegistrarEnrollmentRequest } from "./user.controller";
import { RejectDepartmentWithdrawalRequest } from "./user.controller";
import { RejectRegistrarWithdrawalRequest } from "./user.controller";
import { RejectDepartmentEnrollmentRequest } from "./user.controller";

import { AcceptWithdrawalRequest } from "./user.controller";
import { activateStudent } from "./user.controller";
import { deactivateUser } from "./user.controller";
import { activateUser } from "./user.controller";
import { deleteStaff } from "./user.controller";
import { updateStaff } from "./user.controller";
import { getStaffByDepartment } from "./user.controller";
import { exportAllStudent, exportAllStaff } from "./user.controller";

import { exportLogFile } from "./user.controller";
//import { getAllStaff2 } from "./user.controller";

const assignSection = require("../../helper/assignSection");

// const assignSection = require("../../helper/assignFreshmanCourse");

const validateRegistration = require("../../middlware/validateRegistration");
const validateSRegistration = require("../../middlware/validateSRegistration");
const validateCsv = require("../../middlware/validateCsv")
const validateImage = require("../../middlware/validateImage")
const checkRegistrationStatus = require("../../middlware/checkRegistrationStatus");
const checkRegistrationStatus2 = require("../../middlware/checkRegistrationStatus2");

const checkAddStatus = require("../../middlware/checkAddStatus");
const checkAddStatus2 = require("../../middlware/checkAddStatus2");

const Student  = require("../../models/student.model")

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

import { UploadStudentImage } from "./user.controller";
import { getStudentImage } from "./user.controller";

const storage = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, 'exports/withdrawals');
  },
  filename: (req:any, file:any, cb:any) => {
    const fileName = `${req.body.id}.pdf`;
    cb(null, fileName);
  }
});
const storage2 = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, 'exports/enrollments');
  },
  filename: (req:any, file:any, cb:any) => {
    const fileName = `${req.body.id}.pdf`;
    cb(null, fileName);
  }
});
const storage3 = multer.diskStorage({
  destination: (req:any, file:any, cb:any) => {
    cb(null, 'exports/images');
  },
  filename: (req:any, file:any, cb:any) => {
    const fileName = `${req.body.id}.jpg`;
    cb(null, fileName);
  }
});

const upload = multer({ dest: "uploads/" });
const upload2 =  multer({ storage });
const upload3 =  multer({ storage2 });
const upload4 =  multer({ storage3 });

const ValidatePdf = require("../../middlware/validatePdf")
const ValidatePdf2 = require("../../middlware/validatePdf2")

const Studentrouter = express.Router();

Studentrouter.get("/exportLogFile", exportLogFile);
//Studentrouter.get("/getFilterStaffs", getAllStaff2);

// Register a student

Studentrouter.post("/register/student",accessAuth, validateRegistration, registerStudent);
Studentrouter.post(
  "/register/studentCsv",
  upload.single("file"),
  validateCsv,
  registerStudentCsv
);
Studentrouter.post("/register/staff", validateSRegistration, registerStaff);
Studentrouter.post("/register/add", registerDependency);
Studentrouter.post("/me",accessAuth, getStudentProfile);

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
Studentrouter.patch("/activate", activateUser);
Studentrouter.patch("/student/update", updateStudent);
Studentrouter.patch("/staff/update", updateStaff);

Studentrouter.get("/student/courses/:student_id", getStudentCourses);
Studentrouter.get("/student/coursesStatus/:student_id", getStudentCourseStatus);
Studentrouter.get("/student/coursesSemesters/:student_id", getStudentSemesters);
Studentrouter.post("/student/register", studentRegistration);
Studentrouter.get(
  "/student/registrationCourses/:student_id",
  getstudentRegistrationCourses
);
Studentrouter.get("/student/registrationStatus/:student_id", getStudentRegistrationHistory);
Studentrouter.get("/student/addcourses/:student_id", ListAddCourses);

// Studentrouter.post("/student/dropcourse/:id", dropCourse);
// Studentrouter.post("/student/addcourse/:id", addCourse);
Studentrouter.post("/student/addDrop/:student_id", addDropCourse);
Studentrouter.post("/student/stausUpdate", acceptReject);
Studentrouter.post("/student/stausUpdateRegistrar", acceptRejectRegistrar);
Studentrouter.get("/student/addDrop", getAddDrop);
Studentrouter.get("/student/activeAddDrop/:stud_id", getActiveAddDrop);


Studentrouter.get("/student/withdrawalFile/:id", exportWithdrawalFile);
Studentrouter.get("/student/enrollmentFile/:id", exportEnrollmentFile);
Studentrouter.post("/student/withdrawalRequest",  upload2.single("file"),ValidatePdf, WithdrawalRequest);
Studentrouter.post("/student/enrollmentRequest",  upload2.single("file"),ValidatePdf2, EnrollmentRequest);
Studentrouter.post("/student/uploadImage",  upload2.single("file"), validateImage, UploadStudentImage);
Studentrouter.get("/student/getImage", getStudentImage);
Studentrouter.get("/student/withdrawalStatus/:id", getWithdrawalStatus);

Studentrouter.get(
  "/department/withdrawalRequests/:department",
  getDepartmentWithdrawalRequests
);
Studentrouter.get(
  "/department/enrollmentRequests/:department",
  getDepartmentEnrollmentRequests
);
Studentrouter.get(
  "/registrar/withdrawalRequests",
  getRegistrarWithdrawalRequests
);
Studentrouter.get(
  "/registrar/enrollmentRequests",
  getRegistrarEnrollmentRequests
);

Studentrouter.post(
  "/department/AcceptwithdrawalRequests",
  AcceptDepartmentWithdrawalRequest
);
Studentrouter.post(
  "/department/AcceptenrollmentRequests",
  AcceptDepartmentEnrollmentRequest
);
Studentrouter.post(
  "/registrar/AcceptwithdrawalRequests",
  AcceptRegistrarWithdrawalRequest
);

Studentrouter.post(
  "/registrar/AcceptenrollmentRequests",
  AcceptRegistrarEnrollmentRequest
);
Studentrouter.post(
  "/registrar/RejectenrollmentRequests",
  RejectRegistrarEnrollmentRequest
);

Studentrouter.post(
  "/department/RejectwithdrawalRequests",
  RejectDepartmentWithdrawalRequest
);
Studentrouter.post(
  "/department/RejectEnrollmentRequests",
  RejectDepartmentEnrollmentRequest
);
Studentrouter.post(
  "/registrar/RejectwithdrawalRequests",
  RejectRegistrarWithdrawalRequest
);

Studentrouter.post("/students/activateStudent", activateStudent);

Studentrouter.get(
  "/department/getStudentStatus/:department",
  getDepartmentRegistrationStatus
);
Studentrouter.post(
  "/department/confirmStudentStatus",
  confirmDepartmentRegistration
);
Studentrouter.post(
  "/department/rejectStudentStatus",
  rejectDepartmentRegistration
);

Studentrouter.get(
  "/registrar/getStudentStatus",
  getRegistrarRegistrationStatus
);
Studentrouter.post(
  "/registrar/confirmStudentStatus",
  confirmRegistrarRegistration
);
Studentrouter.post(
  "/registrar/rejectStudentStatus",
  rejectRegistrarRegistration
);

Studentrouter.get("/template", getTemplate);

Studentrouter.post("/student/test", async (req: Request, res: Response) => {
  const { department, year, semester, max, type } = req.body;
  const a = await assignSection({
    department,
    year,
    semester,
    max,
    type,
  });
  if (a.success) {
    res.status(200).json(a);
  } else {
    res.status(400).json(a);
  }
});

Studentrouter.get("/student/numberofstudent/:course_id", getNumberOfStudents);

module.exports = Studentrouter;
