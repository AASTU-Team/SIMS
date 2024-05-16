import express from "express";

import { createRooms } from "./dormitory.controller";
import { assignDormitory } from "./dormitory.controller";

const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });




const Dormitoryrouter = express.Router();
Dormitoryrouter.post("/new",createRooms);
Dormitoryrouter.post("/assignStudents",upload.single("file"), assignDormitory);


module.exports = Dormitoryrouter;
