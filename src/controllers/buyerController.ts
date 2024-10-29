import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { BuyerService } from '../services/buyerServices';
import { prisma } from '../libs/prisma';
import { CartService } from '../services/cartService';
import { OrderService } from '../services/orderService';

const user = new BuyerService();
const cartService = new CartService();
const orderService = new OrderService();
export class BuyerControllers {
    async create(req: Request, res: Response) {
        const data = req.body;
        const { confirmPassword, password } = req.body;

        if (password !== confirmPassword) {
            return res.status(401).json({ error: 'Passwords do not match' });
        }

        const userData = await user.create(data);

        //@ts-expect-error
        if (userData.name === 'PrismaClientKnownRequestError') {
            return res.status(401).json({ error: 'Data already exists' });
        }

        res.status(201).json({ userData });
    }

    async login(req: Request, res: Response) {
        const data = req.body;
        // res.json({data});

        try {
            const userVerify = await prisma.buyer.findFirst({
                where: {
                    email: data.email.toLowerCase(),
                },
            });

            if (!userVerify) {
                return res.status(404).json({ error: 'E-mail not found' });
            }

            const verifyPass = await bcrypt.compare(data.password, userVerify.password);

            if (!verifyPass) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            const token = jwt.sign({ id: userVerify.id }, process.env.JWT_PASS as string);
            const loginData = {
                ...data,
                token,
            };
            const userData = await user.login(loginData);

            res.status(200).json({ userData });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getUser(req: Request, res: Response) {
        const id = req.user;
        const result = await user.getProfile(id);

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ result });
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const updatedData = req.body;
            const updatedUser = await user.update(userId, updatedData);

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'User updated successfully', updatedUser });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const deletedUser = await user.delete(userId);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ message: 'Account deleted' });
        } catch (error) {
            res.status(500).json(error);
        }
    }
    async addToCart(req: Request, res: Response) {
        try {

            const { productId, quantity } = req.body;
            const {id} = req.user
            const cartItem = await cartService.addToCart(id, productId, quantity);
            console.log("oi")
          return res.json(cartItem);
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
    
      async getCart(req: Request, res: Response) {
        try {
          const { buyerId } = req.params;
          const cart = await cartService.getCart(Number(buyerId));
          return res.json(cart);
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
    
      async checkout(req: Request, res: Response) {
        try {
          const { buyerId } = req.body;
          const order = await orderService.createOrder(Number(buyerId));
          return res.json(order);
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
    
      async getOrders(req: Request, res: Response) {
        try {
          const { buyerId } = req.params;
          const orders = await orderService.getOrders(Number(buyerId));
          return res.json(orders);
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
    
      async updateCartItem(req: Request, res: Response) {
        try {
          const { cartItemId } = req.params;
          const { quantity } = req.body;
          const cartItem = await cartService.updateCartItemQuantity(cartItemId, quantity);
          return res.json(cartItem);
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }

      async removeCartItem(req: Request, res: Response) {
        try {
          const { cartItemId } = req.params;
          await cartService.removeFromCart(cartItemId);
          return res.json({ message: 'Item removido do carrinho' });
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
      async clearCart(req: Request, res: Response) {
        try {
          const { cartId } = req.params;
          await cartService.clearCart(cartId);
          return res.json({ message: 'Carrinho vazio' });
        } catch (error) {
          return res.status(400).json({ error: "error" });
        }
      }
}
