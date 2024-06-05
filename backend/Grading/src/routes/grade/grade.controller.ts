import { Request, Response } from 'express';
import Assessment from '../../models/assesment.model';
import Grade from '../../models/grade.model';
import Student from '../../models/student.model';

interface AuthRequest extends Request {
    userId?: string;
}

// Calculate and set final grade for a student
export const calculateAndSetGrade = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    
    try {
        // Fetch all assessments for the student
        const assessments = await Assessment.find({ studentId });

        if (assessments.length === 0) {
            return res.status(404).json({ message: 'No assessments found for this student' });
        }

        // Check for any missing assessments
        if (assessments.some(assessment => !assessment.submitted)) {
            return res.status(200).json({ grade: 'NG' }); // Return 'NG' if any assessments are missing
        }

        // Calculate the total score and the total maximum possible score
        let totalScore = 0;
        let totalMaxScore = 0;
        assessments.forEach(assessment => {
            if (assessment.score && assessment.maxScore) {
                totalScore += assessment.score;
                totalMaxScore += assessment.maxScore;
            }
        });

        // Scale the total score to a maximum of 100
        const scaledScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

        // Determine the final letter grade based on the scaled score
        const grade = determineGrade(scaledScore);

        // Update or create the grade record
        const existingGrade = await Grade.findOne({ studentId });
        if (existingGrade) {
            existingGrade.grade = grade;
            await existingGrade.save();
        } else {
            const newGrade = new Grade({ studentId, grade });
            await newGrade.save();
        }

        res.status(200).json({ grade });
    } catch (error: any) {
        console.error('Error calculating or setting the grade:', error);
        res.status(500).json({ message: "Failed to calculate or set grade", error: error.message });
    }
};

// Retrieve all grades for a specific student
export const getStudentGrades = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    try {
        const grades = await Grade.find({ studentId }).populate('assessmentId');
        if (!grades) {
            return res.status(404).json({ message: 'No grades found for this student.' });
        }
        res.status(200).json(grades);
    } catch (error: any) {
        console.error('Error retrieving student grades:', error);
        res.status(500).json({ message: "Failed to retrieve grades", error: error.message });
    }
};

// Set or update a grade for a specific assessment and student
export const setOrUpdateGrade = async (req: Request, res: Response) => {
    const { studentId, assessmentId, grade } = req.body;
    try {
        const existingGrade = await Grade.findOneAndUpdate(
            { studentId, assessmentId },
            { grade },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Grade set/updated successfully', data: existingGrade });
    } catch (error: any) {
        console.error('Error setting/updating the grade:', error);
        res.status(500).json({ message: "Failed to set/update grade", error: error.message });
    }
};

// View grades for all students in a specific course
export const getCourseGrades = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    try {
        const grades = await Grade.find({ courseId }).populate('studentId').populate('assessmentId');
        res.status(200).json(grades);
    } catch (error: any) {
        console.error('Error retrieving course grades:', error);
        res.status(500).json({ message: "Failed to retrieve course grades", error: error.message });
    }
};

// List of students taught by the teacher
export const listStudentsTaughtByTeacher = async (req: Request, res: Response) => {
    const { teacherId, name, section, courses, batch, semester, id } = req.query;
    try {
        // Fetch all students taught by this teacher
        const students = await Student.find({ teacherId, name, section, courses, batch, semester, id });
        res.status(200).json(students);
    } catch (error: any) {
        console.error('Error retrieving students:', error);
        res.status(500).json({ message: "Failed to retrieve students", error: error.message });
    }
};

// View grades for each student
export const viewGradeForStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    try {
        const grades = await Grade.find({ studentId }).populate('assessmentId');
        if (!grades) {
            return res.status(404).json({ message: 'No grades found for this student.' });
        }
        res.status(200).json(grades);
    } catch (error: any) {
        console.error('Error retrieving grades:', error);
        res.status(500).json({ message: "Failed to retrieve grades", error: error.message });
    }
};

// Set grade for each student
export const setGradeForStudent = async (req: Request, res: Response) => {
    const { studentId, assessmentId, grade } = req.body;
    try {
        const existingGrade = await Grade.findOneAndUpdate(
            { studentId, assessmentId },
            { grade },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: 'Grade set/updated successfully', data: existingGrade });
    } catch (error: any) {
        console.error('Error setting/updating the grade:', error);
        res.status(500).json({ message: "Failed to set/update grade", error: error.message });
    }
};


// Student view of grades for a specific course
export const studentViewOfGrade = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;

    try {
        // Ensure the requester is viewing their own grades
        const studentId = req.userId;
        if (!studentId) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own grades.' });
        }

        const grades = await Grade.find({ studentId, courseId }).populate('assessmentId');
        res.status(200).json(grades);
    } catch (error: any) {
        console.error('Error retrieving course grades:', error);
        res.status(500).json({ message: "Failed to retrieve course grades", error: error.message });
    }
};

// Helper function to determine the letter grade
function determineGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'F';
}

export default {
    listStudentsTaughtByTeacher,
    viewGradeForStudent,
    setGradeForStudent,
    studentViewOfGrade,
    getStudentGrades,
    setOrUpdateGrade,
    getCourseGrades,
    calculateAndSetGrade
};