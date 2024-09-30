import { Router } from 'express';
import { BuyerControllers } from '../controllers/buyerController';
import { validated } from '../middlewares/validate';
import { buyerSchema } from '../schemas/buyerSchemas';
import { userAuth } from '../middlewares/userAuth';
import { loginSchema } from '../schemas/sellerSchemas';

export const buyerRoutes = Router();

const buyerController = new BuyerControllers();

buyerRoutes.get('/me', userAuth, buyerController.getUser);
buyerRoutes.post('/register', validated(buyerSchema), buyerController.create);
buyerRoutes.post('/login', validated(loginSchema), buyerController.login);
