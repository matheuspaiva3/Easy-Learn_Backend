import { Router } from 'express';
import { BuyerControllers } from '../controllers/buyerController';
import { validated } from '../middlewares/validate';
import { buyerSchema, updatedBuyerSchema } from '../schemas/buyerSchemas';
import { userAuth } from '../middlewares/userAuth';
import { loginSchema } from '../schemas/sellerSchemas';

export const buyerRoutes = Router();

const buyerController = new BuyerControllers();

// Rotas do comprador
buyerRoutes.get('/me', userAuth, buyerController.getUser);
buyerRoutes.post('/register', validated(buyerSchema), buyerController.create);
buyerRoutes.post('/login', validated(loginSchema), buyerController.login);
buyerRoutes.put('/update', userAuth, validated(updatedBuyerSchema), buyerController.update);
buyerRoutes.delete('/delete', userAuth, buyerController.delete);

// Rotas do carrinho
buyerRoutes.post('/cart/add', userAuth,buyerController.addToCart);
buyerRoutes.get('/cart/:buyerId', buyerController.getCart);
buyerRoutes.put('/cart/item/:cartItemId', buyerController.updateCartItem);
buyerRoutes.delete('/cart/item/:cartItemId', buyerController.removeCartItem);
buyerRoutes.delete('/cart/:cartId', buyerController.clearCart);


// Rotas de pedidos
buyerRoutes.post('/checkout', buyerController.checkout);
buyerRoutes.get('/orders/:buyerId', buyerController.getOrders);