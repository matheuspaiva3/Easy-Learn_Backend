import { Router } from "express";
import { UserControllers } from "../controllers/userController";
import { validated } from "../middlewares/validate";
import { loginSchema, userSchema } from "../schemas/userSchemas";

export const userRoutes = Router();

const userController = new UserControllers();

userRoutes.post("/register", validated(userSchema), userController.create);
userRoutes.post("/login", validated(loginSchema), userController.login);
