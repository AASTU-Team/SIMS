import express from 'express';

import { registerStudent, getAllStudents } from './user.controller';
import { registerStaff } from './user.controller';
import { registerDependency } from './user.controller';
import { registerStudentCsv } from './user.controller';
import { uploadFile } from './user.controller';
import { Request,Response } from "express";

const Studentrouter = express.Router();

Studentrouter.get('/students', getAllStudents);
Studentrouter.post('/register/student', registerStudent);
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

module.exports =  Studentrouter;

