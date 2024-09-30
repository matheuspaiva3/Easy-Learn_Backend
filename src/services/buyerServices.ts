import { prisma } from "../libs/prisma";
import { buyer } from "../schemas/buyerSchemas";
import bcrypt from "bcrypt";
import { JwtPayload } from "../types/type";
import { login } from "../schemas/sellerSchemas";

export class BuyerService {
    async create(data: buyer) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            const user = await prisma.buyer.create({
                data: {
                    name: data.name.toLowerCase(),
                    email: data.email.toLowerCase(),
                    password: hashedPassword,
                    cpf: data.cpf,
                    phone: data.phone,
                },
            });
            return user;
        } catch (e) {
            return e;
        }
    }
    async login(data: login) {
        try {
            const user = await prisma.buyer.findUnique({
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
        } catch (e) {
            return e;
        }
    }
    async getProfile(data: JwtPayload) {
        const { id } = data;
        if (typeof id !== "number") {
            return null;
        }
        const user = await prisma.buyer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                phone: true,
                products: true,
            },
        });
        if (!user) {
            return null;
        }
        return user;
    }
}
