import express from "express";

import {
  getAttendance,
  registerAttendance,
  editAttendance,
  deleteAttendance,
} from "./attendance.controller";
import { getInstructorAttendance } from "./attendance.controller";

const Attendancerouter = express.Router();

Attendancerouter.get("/hi", (req, res) => {
  console.log("hi");
  res.send("hi");
});

9;
Attendancerouter.post("/new", registerAttendance);

Attendancerouter.post("/instructor", getInstructorAttendance);

Attendancerouter.post("/student", getAttendance);

Attendancerouter.patch("/attendance", editAttendance);

Attendancerouter.delete("/", deleteAttendance);

module.exports = Attendancerouter;
