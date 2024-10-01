import { prisma } from '../libs/prisma';
import { category } from '../schemas/categorySchemas';

export class Category {
    async create(data: category) {
        try {
            const result = await prisma.category.create({
                data: { name: data.name.toLowerCase() }
            });

            return result;
        } catch (error) {
            return error;
        }
    }
}
