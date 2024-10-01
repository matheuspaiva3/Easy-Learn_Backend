import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from '../types/type';

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASS as string) as JwtPayload;

        req.user = { id };
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
};
