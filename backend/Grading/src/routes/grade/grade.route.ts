import express from 'express';
import GradeController from './grade.controller';  // Adjust the path as necessary

const router = express.Router();

// Route to create a grade document for a student in a course
router.post('/grades', GradeController.createGrade);

// Route to update an assessment within a grade document
router.put('/grades/:gradeId/assessments/:assessmentId', GradeController.updateAssessment);

// Route to get all grades for a specific student
router.get('/grades/:studentId', GradeController.getGrades);

// Route to get a specific grade for a student in a course
router.get('/grades/:studentId/:courseId', GradeController.getGrade);

// Route to list all students with their assessments and grades for a given course and optional filters
router.get('/instructor/:instructorId/courses', GradeController.getFilteredCourses);

router.post('/calculateGPAs', GradeController.calculateGPAs);

router.get('/courses/:courseId/students', GradeController.getStudentsByCourseAndInstructor);

export default router;