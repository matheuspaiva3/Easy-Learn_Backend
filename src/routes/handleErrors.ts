import { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundRequest: RequestHandler = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

export const internalErrorRequest: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
};
