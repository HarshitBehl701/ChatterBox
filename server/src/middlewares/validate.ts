import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { responseStructure, handleCatchErrorResponse } from '../utils/commonUtils';

const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json(responseStructure(false,error.details[0].message));
            return;
        }
        next();
    } catch (error) {
        res.status(500).json(responseStructure(false,handleCatchErrorResponse(error)));
    }
};

export default validate;