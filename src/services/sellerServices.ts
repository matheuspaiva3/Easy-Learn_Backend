import bcrypt from 'bcrypt';

import { prisma } from '../libs/prisma';
import { seller } from '../schemas/sellerSchemas';
import { JwtPayload } from '../types/type';
import { login } from '../schemas/sellerSchemas';

export class SellerService {
    async create(data: seller) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        try {
            const user = await prisma.seller.create({
                data: {
                    name: data.name.toLowerCase(),
                    email: data.email.toLowerCase(),
                    password: hashedPassword,
                    cpf: data.cpf,
                    phone: data.phone,
                },
            });

            return user;
        } catch (error) {
            return error;
        }
    }

    async login(data: login) {
        try {
            const user = await prisma.seller.findUnique({
                where: { email: data.email.toLowerCase() },
                select: {
                    name: true,
                    email: true,
                },
            });

            const result = {
                ...user,
                token: data.token,
            };

            return result;
        } catch (error) {
            return error;
        }
    }

    async getProfile(data: JwtPayload) {
        const { id } = data;

        if (typeof id !== 'number') {
            return null;
        }

        const user = await prisma.seller.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                phone: true,
                Products: true,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    }

    async update(userId: number, updatedData: Partial<seller>) {
        try {
            if (updatedData.password) {
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }

            const updatedUser = await prisma.seller.update({
                where: { id: userId },
                data: {
                    name: updatedData.name?.toLowerCase(),
                    email: updatedData.email?.toLowerCase(),
                    cpf: updatedData.cpf,
                    phone: updatedData.phone,
                    password: updatedData.password,
                },
            });

            return updatedUser;
        } catch (error) {
            return error;
        }
    }

    async delete(userId: number) {
        try {
            const deletedUser = await prisma.seller.delete({
                where: { id: userId },
            });

            return deletedUser;
        } catch (error) {
            return error;
        }
    }

    async getSalesForLast7Days(sellerId: number) {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);
            sevenDaysAgo.setUTCHours(0, 0, 0, 0);

            const sales = await prisma.order.findMany({
                where: {
                    items: { some: { product: { sellerId } } },
                    createdAt: { gte: sevenDaysAgo, lte: today },
                    status: 'PAID',
                },
            });

            const dailySales = Array(7)
                .fill(null)
                .map((_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);

                    const totalSales = sales
                        .filter((order) => {
                            const orderDate = new Date(order.createdAt);
                            return (
                                orderDate.toISOString().split('T')[0] ===
                                date.toISOString().split('T')[0]
                            );
                        })
                        .reduce((sum, order) => sum + (order.total || 0), 0);

                    return {
                        date: date.toISOString().split('T')[0],
                        sales: totalSales,
                    };
                });

            return dailySales.reverse();
        } catch (error) {
            return error;
        }
    }

    async getDashboardSummary(sellerId: number) {
        try {
            const available = await prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    items: { some: { product: { sellerId } } },
                    status: 'PAID',
                },
            });

            const pending = await prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    items: { some: { product: { sellerId } } },
                    status: 'PENDING',
                },
            });

            const reserved = 0;
            const totalAvailable = available._sum.total || 0;
            const totalPending = pending._sum.total || 0;

            return {
                available: totalAvailable,
                pending: totalPending,
                reserved,
                total: totalAvailable + totalPending,
            };
        } catch (error) {
            return error;
        }
    }
}
