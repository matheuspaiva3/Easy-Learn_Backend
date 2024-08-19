import { prisma } from "../libs/prisma";
import { product } from "../schemas/productSchemas";

export class ProductServices{
    async create(data:product){
        const product = await prisma.products.create({
            data:{
                title: data.body.title,
                price: data.body.price,
                description: data.body.description,
                content: data.body.content,
                image: data.imageName,
                UserId: data.userId,
                categoryId: data.categoryId,
            }
        })
        return product
    }
}