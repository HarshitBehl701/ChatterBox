import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { responseStructure, handleCatchErrorResponse } from '../utils/commonUtils';
import UserModel from '../modals/UserModal';

interface AuthRequest extends Request {
    user?: any; // You can replace 'any' with a proper user type/interface
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | null = req.cookies?.ULOGINTOKEN || null;
    
    if (!token) {
        res.status(409).json(responseStructure(false, "Access Denied"));
        return;
    }

    try {
        const secretKey: string = process.env.SECRET_KEY || '';
        const verifyToken = jwt.verify(token, secretKey) as { id: string };

        if (!verifyToken) {
            res.status(409).json(responseStructure(false, "Access Denied"));
            return;
        }

        const userId: string = verifyToken.id;
        const user = await UserModel.findOne({ _id: userId, is_active: 1 });

        if (!user) {
            res.status(409).json(responseStructure(false, "Access Denied"));
            return;
        }
        
        (req as  any).user = user;
        next();
    } catch (err) {
        res.status(500).json(responseStructure(false, handleCatchErrorResponse(err)));
    }
};

export default authMiddleware;