import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validated = <T>(schema: ZodSchema<T>): RequestHandler => {
    return async (req, res, next) => {
        const data = req.body;
        const validated = schema.safeParse(data);

        if (validated.success) {
            console.log('Request body accepted');
            next();
        } else {
            res.status(400).json({ invalidField: validated.error });
        }
    };
};
