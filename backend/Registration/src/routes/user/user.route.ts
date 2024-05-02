import express from 'express';

import { registerStudent } from './user.controller';
import { registerStaff } from './user.controller';
import { registerDependency } from './user.controller';
import { registerStudentCsv } from './user.controller';
import { uploadFile } from './user.controller';
import { getAllStudent } from './user.controller';
import { getStudentByDepartment } from './user.controller';
import { deleteStudent } from './user.controller';
import { updateStudent } from './user.controller';
import { Request,Response } from "express";
const validateRegistration = require('../../middlware/validateRegistration')
const validateSRegistration = require('../../middlware/validateSRegistration')


const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });





const Studentrouter = express.Router();


// Register a student
Studentrouter.post('/register/student', validateRegistration, registerStudent);
Studentrouter.post('/register/studentCsv', registerStudentCsv);
Studentrouter.post('/register/staff', validateSRegistration, registerStaff);
Studentrouter.post('/register/add', registerDependency);

Studentrouter.post('/upload', upload.single('file'), uploadFile);
Studentrouter.get('/student/all', getAllStudent);
Studentrouter.get('/student/department', getStudentByDepartment); 
Studentrouter.delete('/student/delete', deleteStudent); 
Studentrouter.patch('/student/update', updateStudent);



module.exports =  Studentrouter;