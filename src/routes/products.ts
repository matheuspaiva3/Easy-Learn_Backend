import { Router } from "express";
import { validated } from "../middlewares/validate";
import { productSchema } from "../schemas/productSchemas";
import { ProductController } from "../controllers/productsController";

export const productsRoutes = Router()
const productsController = new ProductController()

productsRoutes.get('/', (req,res)=> {
    res.json({teste:"teste"})
})
productsRoutes.post('/', validated(productSchema),productsController.create)
