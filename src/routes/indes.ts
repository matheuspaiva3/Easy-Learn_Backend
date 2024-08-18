import { Response, Router } from "express";

export const routes = Router()

routes.get('/ping',(res:Response) =>{
    res.json({pong:true})
})