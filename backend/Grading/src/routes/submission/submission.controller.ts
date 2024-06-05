import { Request, Response } from 'express';
import Submission from '../../models/submission.model';

export const createOrUpdateSubmission = async (req: Request, res: Response) => {
    const { assessment_id, student_id, file_path, score, status } = req.body;
    try {
        let submission = await Submission.findOne({ assessment_id, student_id });
        if (submission) {
            // Update existing submission
            submission.file_path = file_path || submission.file_path;
            submission.score = score || submission.score;
            submission.status = status || submission.status;
            await submission.save();
            res.status(200).json({ message: 'Submission updated successfully', data: submission });
        } else {
            // Create new submission if none exists
            submission = new Submission({ assessment_id, student_id, file_path, score, status });
            await submission.save();
            res.status(201).json({ message: 'Submission created successfully', data: submission });
        }
    } catch (error: any) { 
        res.status(500).json({ message: 'Failed to process submission', error: error.message });
    }
};

export const getAllSubmissionsForAssessment = async (req: Request, res: Response) => {
    const { assessmentId } = req.params;
    try {
        const submissions = await Submission.find({ assessment_id: assessmentId });
        res.status(200).json(submissions);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve submissions', error: error.message });
    }
};

export const deleteSubmission = async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    try {
        const result = await Submission.findByIdAndDelete(submissionId);
        if (!result) {
            res.status(404).json({ message: 'Submission not found' });
        } else {
            res.status(200).json({ message: 'Submission deleted successfully' });
        }
    } catch (error: any) { 
        res.status(500).json({ message: 'Failed to delete submission', error: error.message });
    }
};
