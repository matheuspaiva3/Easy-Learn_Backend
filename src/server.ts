import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { routes } from './routes';
import { internalErrorRequest, notFoundRequest } from './routes/handleErrors';

dotenv.config();

const server = express();

server.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    }),
);
server.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(routes);
server.use(notFoundRequest);
server.use(internalErrorRequest);
server.use('/images', express.static(path.resolve(__dirname, '..', 'public', 'images')));

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
