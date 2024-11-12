import { Router } from 'express';
import { validated } from '../middlewares/validate';
import { productSchema } from '../schemas/productSchemas';
import { ProductController } from '../controllers/productsController';
import { upload } from '../middlewares/multer';
import { userAuth } from '../middlewares/userAuth';

export const productsRoutes = Router();

const productsController = new ProductController();

productsRoutes.get('/', productsController.listProducts);
productsRoutes.put('/products/:id', userAuth, productsController.update);
productsRoutes.get('/:id', userAuth, productsController.getProduct);
productsRoutes.put('/:id', userAuth, productsController.update);
productsRoutes.put('/item/:id', userAuth, productsController.update);

productsRoutes.post(
    '/',
    userAuth,
    upload.fields([{ name: 'image' }, { name: 'pdf' }, { name: 'video' }]),
    validated(productSchema),
    productsController.create,
);

productsRoutes.put('/item/:id', userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = await productsController.update(parseInt(id), updateData);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});
