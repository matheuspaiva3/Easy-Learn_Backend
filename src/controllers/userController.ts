import { Request, Response } from "express";
import { UserService } from "../services/userServices";
import { prisma } from "../libs/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
    async login(req:Request,res:Response){
        const data = req.body
        // res.json({data})
        try{
            const userVerify = await prisma.user.findFirst({
                where: {
                    email:data.email.toLowerCase()
                }
            })
            if(!userVerify){
                return res.json({e:'Email not found'})
            }
            const verifyPass = await bcrypt.compare(data.password,userVerify.password)
            if(!verifyPass){
                return res.json({e:'Wrong password'})
            }
            const token = jwt.sign({id: userVerify.id}, process.env.JWT_PASS as string)
            const loginData = {
                ...data,
                token
            }
            const userData = await user.login(loginData)
            res.status(200).json({userData})
        }catch(e){
            res.json(e)
        }
    }
    async getUser(req:Request,res:Response){
        const id = req.body
        const result = await user.getProfile(id)
        res.json({result})
    }
}