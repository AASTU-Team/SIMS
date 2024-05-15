import express from "express";

import {
  getDep,
  getDepById,
  createDep,
  updateDep,
  deleteDep,
  assignDepartmentCsv
} from "./department.controller";

import { Request, Response } from "express";
const validateRegistration = require("../../middlware/validateRegistration");
const validateSRegistration = require("../../middlware/validateSRegistration");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const departmentRoute = express.Router();

// get course based on dept
departmentRoute.get("/", getDep);
departmentRoute.get("/:id", getDepById);
departmentRoute.post("/create", createDep);
departmentRoute.patch("/:id", updateDep);
departmentRoute.delete("/:id", deleteDep);
departmentRoute.post("/assignStudents",upload.single("file"), assignDepartmentCsv);

module.exports = departmentRoute;
