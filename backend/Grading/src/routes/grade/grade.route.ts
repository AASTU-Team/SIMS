import express from 'express';
import { verifyToken } from '../../middlewares/auth.middleware';
import gradeController from './grade.controller';

const router = express.Router();

// List of students taught by the teacher
router.get('/students', verifyToken, gradeController.listStudentsTaughtByTeacher);

// Retrieve grades for a specific student
router.get('/student/:studentId', verifyToken, gradeController.getStudentGrades);

// Set or update a grade
router.post('/grade', verifyToken, gradeController.setOrUpdateGrade);

// Get grades for all students in a specific course
router.get('/course/:courseId', verifyToken, gradeController.getCourseGrades);

// Student view of grades for a specific course
router.get('/mygrade/:courseId', verifyToken, gradeController.studentViewOfGrade);

// Calculate and set the final grade for a student
router.post('/calculate/:studentId', verifyToken, gradeController.calculateAndSetGrade);

export default router;
