import { Request, Response, Router } from "express";
import { userRoutes } from "./userRoutes";

export const routes = Router()

routes.use("/user",userRoutes)
routes.get('/ping',(req:Request,res:Response) =>{
    res.json({pong:true})
})
