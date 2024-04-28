import express from "express";

import {
  getAttendance,
  registerAttendance,
  editAttendance,
} from "./attendance.controller";
import { getInstructorAttendance } from "./attendance.controller";

const Attendancerouter = express.Router();

Attendancerouter.post("/new", registerAttendance);

Attendancerouter.get("/instructor", getInstructorAttendance);

Attendancerouter.get("/student", getAttendance);

Attendancerouter.patch("/attendance", editAttendance);

module.exports = Attendancerouter;
