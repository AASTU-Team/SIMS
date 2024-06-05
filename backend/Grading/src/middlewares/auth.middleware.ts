import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    userId?: string;
}

interface UserProfile {
    id: string;
    // Add other fields as needed
}

interface ErrorResponse {
    message: string;
    // Add other fields as needed
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer Token
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const response = await fetch(`${process.env.AUTH_SERVICE_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData: ErrorResponse = await response.json() as ErrorResponse;
            return res.status(response.status).send(errorData.message);
        }

        const data: UserProfile = await response.json() as UserProfile;
        req.userId = data.id; 
        next();
    } catch (err) {
        return res.status(500).send('Internal Server Error');
    }
};
