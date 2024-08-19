import { prisma } from "../libs/prisma";
import { category } from "../schemas/categorySchemas";

export class Category {
  async create(data: category) {
    const name = data;
    try {
      const result = await prisma.category.create({
        data: name,
      });
      return result;
    } catch (e) {
      return e;
    }
  }
}
