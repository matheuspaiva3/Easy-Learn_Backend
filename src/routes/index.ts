import { Request, Response, Router } from "express";
import { userRoutes } from "./userRoutes";
import { catRoutes } from "./category";
import { productsRoutes } from "./products"

export const routes = Router()

routes.use("/user",userRoutes)
routes.use("/category",catRoutes)
routes.use('/products',productsRoutes)
routes.get('/ping',(req:Request,res:Response) =>{
    res.json({pong:true})
})
