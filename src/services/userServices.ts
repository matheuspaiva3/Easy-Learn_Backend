import { Request } from "express";
import { prisma } from "../libs/prisma";
import { user } from "../schemas/userSchemas";

export class UserService {
    async create(data:user){
        try{
            const user = await prisma.user.create({
                data:{
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    cpf: data.cpf,
                    phone: data.phone
                }
            })
            return user
        }catch(e){
            return e
        }
    }
}