import { Router } from 'express';
import { SellerControllers } from '../controllers/sellerController';
import { validated } from '../middlewares/validate';
import { loginSchema, sellerSchema, updatedSellerSchema } from '../schemas/sellerSchemas';
import { userAuth } from '../middlewares/userAuth';

export const sellerRoutes = Router();

const sellerController = new SellerControllers();

sellerRoutes.get('/me', userAuth, sellerController.getUser);

sellerRoutes.post('/register', validated(sellerSchema), sellerController.create);
sellerRoutes.post('/login', validated(loginSchema), sellerController.login);

sellerRoutes.put('/update', userAuth, validated(updatedSellerSchema), sellerController.update);

sellerRoutes.delete('/delete', userAuth, sellerController.delete);

sellerRoutes.get('/dashboard/extract', userAuth, sellerController.getExtract);
sellerRoutes.get('/dashboard/chart-data', userAuth, sellerController.getChartData);
sellerRoutes.get('/dashboard/sales', userAuth, sellerController.getSalesForLast7Days);
sellerRoutes.get('/dashboard/summary', userAuth, sellerController.getDashboardSummary);
