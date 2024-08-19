import { Request, Response } from "express";

export class ProductController {
    async create(req: Request, res: Response){
        const data = req.body
        res.json({data})
    }
}