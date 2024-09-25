import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    console.log('Token received:', token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decodedToken: any) => {
            if (err) {
                console.log(err.message);
                res.status(403).json({ message: 'Invalid or expired token' });
            } else {
                console.log('Decoded token:', decodedToken);
                req.userId = decodedToken.id
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

