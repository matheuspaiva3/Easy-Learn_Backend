import { Router } from 'express';
import { validated } from '../middlewares/validate';
import { productSchema } from '../schemas/productSchemas';
import { ProductController } from '../controllers/productsController';
import { upload } from '../middlewares/multer';
import { userAuth } from '../middlewares/userAuth';

export const productsRoutes = Router();

const productsController = new ProductController();

productsRoutes.get('/', productsController.listProducts);

productsRoutes.post(
    '/',
    userAuth,
    upload.fields([{ name: 'image' }, { name: 'pdf' }, { name: 'video' }]),
    validated(productSchema),
    productsController.create,
);
