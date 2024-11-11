import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { validated } from '../middlewares/validate';
import { categorySchema } from '../schemas/categorySchemas';

export const catRoutes = Router();

const categoryController = new CategoryController();

catRoutes.post('/create', validated(categorySchema), categoryController.create);
