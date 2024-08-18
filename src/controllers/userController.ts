import { Request, Response } from "express";
import { userSchema } from "../schemas/userSchemas";
import { UserService } from "../services/userServices";

const user = new UserService()
export class UserControllers{
    async create(req:Request, res:Response){
       const data = req.body
       const {confirmPassword, password} = req.body
       if(password !== confirmPassword){
        return res.json({error:'As senhas não conferem'})
       }
       const userData = await user.create(data)
       res.status(201).json({userData})
    }
}