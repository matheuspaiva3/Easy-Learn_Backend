import { Router } from "express";
import { SellerControllers } from "../controllers/sellerController";
import { validated } from "../middlewares/validate";
import { loginSchema, sellerSchema } from "../schemas/sellerSchemas";
import { userAuth } from "../middlewares/userAuth";

export const sellerRoutes = Router();

const sellerController = new SellerControllers();

sellerRoutes.post("/register", validated(sellerSchema), sellerController.create);
sellerRoutes.post("/login", validated(loginSchema), sellerController.login);
sellerRoutes.get('/me',userAuth,sellerController.getUser)