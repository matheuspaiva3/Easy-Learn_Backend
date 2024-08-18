import { Request, Response, Router } from "express";
import { UserControllers } from "../controllers/userController";
import { validated } from "../middlewares/validate";
import { userSchema } from "../schemas/userSchemas";

export const userRoutes = Router()

const userController = new UserControllers()

userRoutes.get('/',async(req,res)=> {
    res.json({teste:true})
})
userRoutes.post('/register',validated(userSchema),userController.create)