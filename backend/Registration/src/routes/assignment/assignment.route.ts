import express from "express";
import { createSchedule } from "./assignment.controller";





const Assignmentrouter = express.Router();


Assignmentrouter.post("/register",createSchedule);


module.exports = Assignmentrouter;
