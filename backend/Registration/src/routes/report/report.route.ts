import express from "express";

import { getAvgCourseGrade } from "./report.controller";


const reportRouter = express.Router();


reportRouter.get("/avgCourseGrade/:courseId", getAvgCourseGrade);


module.exports = reportRouter;
