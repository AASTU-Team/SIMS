import express from "express";

import {
  getCurriculum,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  updateCurriculumCourse,
  deleteCurriculum,
  removeCurriculumCourse,
  createCurriculumCsv,
  getSpecCurriculum,
  exportCurriculums,
} from "./curriculum.controller";

import { Request, Response } from "express";
const validateRegistration = require("../../middlware/validateRegistration");
const validateSRegistration = require("../../middlware/validateSRegistration");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const validateCsv = require("../../middlware/validateCsv")

const curriculumRoute = express.Router();

// get course based on dept
curriculumRoute.get("/", getCurriculum);
curriculumRoute.get("/spec", getSpecCurriculum);
curriculumRoute.get("/export", exportCurriculums);
curriculumRoute.get("/:id", getCurriculumById);
curriculumRoute.post("/create", createCurriculum);
curriculumRoute.post("/createCsv", upload.single("file"),validateCsv, createCurriculumCsv);
curriculumRoute.patch("/:id", updateCurriculum);
curriculumRoute.patch("/addcourse/:id", updateCurriculumCourse);
curriculumRoute.delete("/deleteCourses/:id", removeCurriculumCourse);
curriculumRoute.delete("/:id", deleteCurriculum);

module.exports = curriculumRoute;
