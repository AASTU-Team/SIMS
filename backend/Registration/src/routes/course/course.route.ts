import express from "express";

import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
  createCourseCsv,
  exportCourses
} from "./course.controller";

import { Request, Response } from "express";
const validateRegistration = require("../../middlware/validateRegistration");
const validateSRegistration = require("../../middlware/validateSRegistration");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const validateCsv = require("../../middlware/validateCsv")

const Courserourer = express.Router();

// get course based on dept
Courserourer.get("/", getCourses);
Courserourer.get("/export", exportCourses);
Courserourer.get("/:id", getCourseById);
Courserourer.post("/create", createCourse);
Courserourer.post("/createCsv",upload.single("file"),validateCsv, createCourseCsv);
Courserourer.patch("/:id", updateCourse);
Courserourer.delete("/:id", deleteCourse);

module.exports = Courserourer;
