import express from 'express';
import { verifyToken } from '../../middlewares/auth.middleware';
import { createOrUpdateSubmission, getAllSubmissionsForAssessment, deleteSubmission } from './submission.controller';

const submissionRoutes = express.Router();

// Route to handle submission creation or update
submissionRoutes.post('/submissions', verifyToken, createOrUpdateSubmission);

// Route to retrieve all submissions for a specific assessment
submissionRoutes.get('/submissions/:assessmentId', verifyToken, getAllSubmissionsForAssessment);

// Route to delete a specific submission
submissionRoutes.delete('/submissions/:submissionId', verifyToken, deleteSubmission);

export default submissionRoutes;
