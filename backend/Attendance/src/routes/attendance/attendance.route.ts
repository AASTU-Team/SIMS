import express from 'express';

import { registerAttendance } from './attendance.controller';
import { getInstructorAttendance } from './attendance.controller';






const Attendancerouter = express.Router();



Attendancerouter.post('/new',registerAttendance);

Attendancerouter.get('/instructor',getInstructorAttendance);


module.exports =  Attendancerouter;



