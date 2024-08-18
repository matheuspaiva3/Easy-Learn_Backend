import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validated = <T>(schema:ZodSchema<T>):RequestHandler => {
    return async(req,res,next) => {
        const data = req.body
        const validated = schema.safeParse(data)
        if(validated.success){
            console.log('Validacao certa')
            next()
        }else{
            res.json({CampoInválido:validated.error})
        }
    }
}
