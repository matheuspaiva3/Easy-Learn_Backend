import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { BuyerService } from '../services/buyerServices';
import { prisma } from '../libs/prisma';

const user = new BuyerService();

export class BuyerControllers {
    async create(req: Request, res: Response) {
        const data = req.body;
        const { confirmPassword, password } = req.body;

        if (password !== confirmPassword) {
            return res.json({ error: 'Passwords do not match' });
        }

        const userData = await user.create(data);
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
                return res.json({ e: 'E-mail not found' });
            }

            const verifyPass = await bcrypt.compare(data.password, userVerify.password);

            if (!verifyPass) {
                return res.json({ e: 'Wrong password' });
            }

            const token = jwt.sign({ id: userVerify.id }, process.env.JWT_PASS as string);
            const loginData = {
                ...data,
                token,
            };
            const userData = await user.login(loginData);

            res.status(200).json({ userData });
        } catch (error) {
            res.json(error);
        }
    }

    async getUser(req: Request, res: Response) {
        const id = req.user;
        const result = await user.getProfile(id);

        res.json({ result });
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
}
