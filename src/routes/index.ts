import { Request, Response, Router } from 'express';
import { sellerRoutes } from './sellerRoutes';
import { buyerRoutes } from './buyerRoutes';
import { catRoutes } from './category';
import { productsRoutes } from './products';

export const routes = Router();

routes.use('/seller', sellerRoutes);
routes.use('/buyer', buyerRoutes);
routes.use('/category', catRoutes);
routes.use('/products', productsRoutes);

routes.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});
