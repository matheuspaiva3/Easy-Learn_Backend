import { Router } from "express";

export const productsRoutes = Router()

productsRoutes.get('/', (req,res) => {
    res.json({true:true})
})