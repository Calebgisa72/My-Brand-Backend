import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';


export const requireSignIn = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            verifyToken(token);
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Token is required' });
    }
};