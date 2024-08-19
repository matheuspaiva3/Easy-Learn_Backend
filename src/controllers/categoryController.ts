import { Request, Response } from "express";
import { Category } from "../services/categoryServices";


const categ = new Category()

export class CategoryController{
    async create(req: Request, res: Response){
        const name = req.body
        console.log(name)
        const result = await categ.create(name)
        res.status(201).json({result})
    }
}