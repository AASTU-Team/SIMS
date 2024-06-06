import express, { Request, Response } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware';
import Assessment from '../../models/assesment.model';
import mongoose from 'mongoose';

const assesmentRoutes = express.Router();

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

// POST: Create a new assessment
assesmentRoutes.post('/', verifyToken, async (req: CustomRequest<AssessmentBody>, res: Response) => {
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

// GET: Retrieve all assessments
assesmentRoutes.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json(assessments);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// GET: Retrieve a specific assessment by ID
assesmentRoutes.get('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const assessment = await Assessment.findById(id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json(assessment);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// PATCH: Update a specific assessment
assesmentRoutes.patch('/:id', verifyToken, async (req: CustomRequest<Partial<AssessmentBody>>, res: Response) => {
    const { id } = req.params;
    try {
        const updatedAssessment = await Assessment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json({ message: 'Assessment updated successfully', data: updatedAssessment });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

// DELETE: Delete a specific assessment
assesmentRoutes.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedAssessment = await Assessment.findByIdAndDelete(id);
        if (!deletedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json({ message: 'Assessment deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});

export default assesmentRoutes;
