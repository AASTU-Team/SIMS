import express, { Request, Response } from 'express';
import { uploadSingle } from '../../middlewares/upload.middleware';
import { verifyToken } from '../../middlewares/auth.middleware';
import Assessment from '../../models/assesment.model';
import Submission from '../../models/submission.model';
import mongoose from 'mongoose';

const router = express.Router();

interface CustomRequest<T> extends Request {
    body: T;
}

interface AssessmentBody {
    course_id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    max_score: number;
    due_date?: Date;
    is_submittable: boolean;
}

interface SubmissionBody {
    studentId: mongoose.Types.ObjectId;
}

// Create a new assessment
router.post('/assessments', verifyToken, async (req: CustomRequest<AssessmentBody>, res: Response) => {
    try {
        const newAssessment = new Assessment(req.body);
        await newAssessment.save();
        res.status(201).json({ message: 'Assessment created successfully', data: newAssessment });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// Submit or update a submission for an assessment
router.post('/submissions/:assessmentId', verifyToken, uploadSingle, async (req: CustomRequest<SubmissionBody>, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or wrong file type' });
    }
    const { assessmentId } = req.params;
    const { studentId } = req.body;
    try {
        let submission = await Submission.findOne({ assessment_id: assessmentId, student_id: studentId });
        if (submission) {
            submission.file_path = req.file.path; // Update if already exists
            submission.submission_date = new Date();
            submission.status = 'Submitted';
            await submission.save();
            res.status(201).json({ message: 'Submission successfully updated', submission });
        } else {
            const newSubmission = new Submission({
                assessment_id: assessmentId,
                student_id: studentId,
                file_path: req.file.path,
                submission_date: new Date(),
                status: 'Submitted'
            });
            await newSubmission.save();
            res.status(201).json({ message: 'Submission successfully saved', newSubmission });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// Get all submissions for an assessment
router.get('/submissions/:assessmentId', verifyToken, async (req: Request, res: Response) => {
    const { assessmentId } = req.params;
    try {
        const submissions = await Submission.find({ assessment_id: assessmentId }).populate('student_id', 'name');
        res.status(200).json(submissions);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// Get a specific submission for an assessment
router.get('/submission/:assessmentId/:studentId', verifyToken, async (req: Request, res: Response) => {
    const { assessmentId, studentId } = req.params;
    try {
        const submission = await Submission.findOne({ assessment_id: assessmentId, student_id: studentId });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json(submission);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

export default router;
