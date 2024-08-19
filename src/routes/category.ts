import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { validated } from "../middlewares/validate";
import { categorySchema } from "../schemas/categorySchemas";

export const catRoutes = Router()
const categoryController = new CategoryController()

catRoutes.get('/create',validated(categorySchema),categoryController.create)