import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import { routes } from './routes';
import { internalErrorRequest, notFoundRequest } from './routes/handleErrors';

dotenv.config();

const server = express();

server.use(helmet());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(routes);
server.use(notFoundRequest);
server.use(internalErrorRequest);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
