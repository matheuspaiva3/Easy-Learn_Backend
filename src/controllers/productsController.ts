import sharp from 'sharp';

import { Request, Response } from 'express';
import { uploadTypes } from '../types/type';
import { productObject } from '../schemas/productSchemas';
import { ProductServices } from '../services/productsServices';
import { prisma } from '../libs/prisma';
import { unlink } from 'fs/promises';

sharp.cache(false);

const productService = new ProductServices();

export class ProductController {
    async create(req: Request, res: Response) {
        const body = await req.body;
        const id = await req.user;
        const files = req.files as uploadTypes;
        const imageName = files.image[0].filename;
        const pdfNames: string[] = [];
        const pdfPaths: string[] = [];
        const videoNames: string[] = [];
        const videoPaths: string[] = [];

        if (files.image) {
            await sharp(files.image[0].path)
                .resize(null, 300, {
                    fit: sharp.fit.cover,
                    position: 'center',
                })
                .toFormat('jpeg')
                .toFile(`./public/images/${files.image[0].filename}`);

            await unlink(files.image[0].path);
        } else {
            res.status(400).json({ error: 'No images' });
        }

        const categoryExists = await prisma.category.findFirst({
            where: {
                name: body.category.toLowerCase(),
            },
            select: {
                id: true,
            },
        });

        // console.log(categoryExists?.id);

        if (!categoryExists) {
            return res.status(200).json({ error: 'Category not found' });
        }

        if (files.pdf && files.pdf.length > 0) {
            files.pdf.forEach((file) => {
                pdfNames.push(file.filename);
                pdfPaths.push(file.path);
            });
        }

        if (files.video && files.video.length > 0) {
            files.video.forEach((file) => {
                videoNames.push(file.filename);
                videoPaths.push(file.path);
            });
        }

        const product = {
            sellerId: id.id,
            categoryId: categoryExists.id,
            body,
            imageName,
            pdfNames,
            pdfPaths,
            videoNames,
            videoPaths,
        };

        // res.json({product});

        const validate = productObject.safeParse(product);

        if (!validate.success) {
            return res.status(200).json({ error: validate.error });
        }

        const result = await productService.create(product);

        res.status(201).json({ result });
    }

    async listProducts(req: Request, res: Response) {
        try {
            const { category } = req.body;

            const result = await productService.listProducts({ category });

            if (result.length === 0) {
                return res.status(404).json({ message: 'No products found' });
            }

            return res.status(200).json({ products: result });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id);
            const userId = req.user.id; // ID do vendedor autenticado
            const updateData = req.body;

            // Primeiro, verificar se o produto existe e pertence ao vendedor
            const existingProduct = await prisma.products.findFirst({
                where: {
                    id: productId,
                    sellerId: userId,
                },
            });

            if (!existingProduct) {
                return res
                    .status(404)
                    .json({ error: 'Produto não encontrado ou não pertence ao vendedor' });
            }

            // Atualizar o produto
            const updatedProduct = await prisma.products.update({
                where: {
                    id: productId,
                },
                data: {
                    title: updateData.title,
                    description: updateData.description,
                    price: updateData.price,
                    content: updateData.content,
                },
                include: {
                    category: true,
                    author: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            res.json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
    }

    async getProduct(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.id);

            const product = await prisma.products.findFirst({
                where: {
                    id: productId,
                },
                include: {
                    category: true,
                    author: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            res.json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Erro ao buscar produto' });
        }
    }
}
