import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { SellerService } from '../services/sellerServices';
import { prisma } from '../libs/prisma';

const user = new SellerService();

export class SellerControllers {
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
            const userVerify = await prisma.seller.findFirst({
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

    async getDashboardSummary(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            const sellerId = req.user.id;
            const summary = await user.getDashboardSummary(sellerId);

            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getSalesForLast7Days(req: Request, res: Response) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            const sellerId = req.user.id;
            const salesData = await user.getSalesForLast7Days(sellerId);

            res.status(200).json({ dailySales: salesData });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getChartData(req: Request, res: Response) {
        try {
            const sellerId = req.user.id;

            const data = await prisma.order.groupBy({
                by: ['createdAt'],
                _sum: { total: true },
                where: {
                    items: { some: { product: { sellerId } } },
                    status: 'PAID',
                },
                orderBy: { createdAt: 'asc' },
            });

            const chartData = data.map((item) => ({
                date: item.createdAt.toISOString().split('T')[0],
                total: item._sum.total || 0,
            }));

            res.status(200).json(chartData);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getExtract(req: Request, res: Response) {
        try {
            const sellerId = req.user.id;

            const extract = await prisma.order.findMany({
                where: {
                    items: { some: { product: { sellerId } } },
                },
                include: {
                    items: {
                        include: { product: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            const formattedExtract = extract.map((order) => ({
                id: order.id,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                products: order.items.map((item) => ({
                    title: item.product.title,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }));

            res.status(200).json(formattedExtract);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
