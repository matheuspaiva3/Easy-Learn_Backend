import { prisma } from "../libs/prisma";
import { product, query } from "../schemas/productSchemas";

export class ProductServices {
  async create(data: product) {
    const { videoNames, videoPaths, pdfNames, pdfPaths } = data;
    const product = await prisma.products.create({
      data: {
        title: data.body.title,
        price: data.body.price,
        description: data.body.description,
        content: data.body.content,
        image: data.imageName,
        sellerId: data.sellerId,
        categoryId: data.categoryId,
      },
    });
    const files = [];
    for (let i = 0; i < videoNames.length; i++) {
      files.push({
        filename: [videoNames[i]],
        path: [videoPaths[i]],
        productId: product.id,
      });
    }
    for (let i = 0; i < pdfNames.length; i++) {
      files.push({
        filename: [pdfNames[i]],
        path: [pdfPaths[i]],
        productId: product.id,
      });
    }
    await prisma.file.createMany({
      data: files,
    });
    return product;
  }
  async getItem(data:query){
    console.log(data)
    const query = data
    const result = await prisma.products.findMany({
        where:{
            title : query.q
        }
    })
    return result
  }
}
