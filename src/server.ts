import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { routes } from "./routes";
import path from "path";
import { internalErrorRequest, notFoundRequest } from "./routes/handleErrors";

dotenv.config();

const server = express();
server.use(helmet());
server.use(express.json());
server.use(express.static(path.join(__dirname, "../public")));
server.use(routes);
server.use(notFoundRequest);
server.use(internalErrorRequest);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
