import { Request, Response } from "express";
import { uploadTypes } from "../types/type";
import { productObject, productSchema } from "../schemas/productSchemas";
import { ProductServices } from "../services/productsServices";
import { prisma } from "../libs/prisma";
import sharp from "sharp";
import { unlink } from "fs/promises";

sharp.cache(false);
const productService = new ProductServices();
export class ProductController {
  async create(req: Request, res: Response) {
    const body = await req.body;
    const id = await req.user;
    const files = req.files as uploadTypes;
    const imageName = files.image[0].filename;
    const pdfNames: string[] = [];
    const videoNames: string[] = [];
    if (files.image) {
      await sharp(files.image[0].path)
        .resize(null, 300, {
          fit: sharp.fit.cover,
          position: "center",
        })
        .toFormat("jpeg")
        .toFile(`./public/images/${files.image[0].filename}`);

      await unlink(files.image[0].path);
    } else {
      res.status(400).json({ error: "No images" });
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
      return res.json({ error: "Category not found" });
    }
    if (files.pdf && files.pdf.length > 0) {
      files.pdf.forEach((file) => {
        pdfNames.push(file.filename);
      });
    }
    if (files.video && files.video.length > 0) {
      files.video.forEach((file) => {
        videoNames.push(file.filename);
      });
    }

    const product = {
      userId: id.id,
      categoryId: categoryExists.id,
      body,
      imageName,
      pdfNames,
      videoNames,
    };
    // res.json({product})
    const validate = productObject.safeParse(product);
    if (!validate.success) {
      return res.json({ error: validate.error });
    }
    const result = await productService.create(product);
    res.status(201).json({result})
  }
}
