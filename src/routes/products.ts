import { Router } from "express";
import { validated } from "../middlewares/validate";
import { productObject, productSchema } from "../schemas/productSchemas";
import { ProductController } from "../controllers/productsController";
import { upload } from "../middlewares/multer";
import { userAuth } from "../middlewares/userAuth";

export const productsRoutes = Router();
const productsController = new ProductController();

productsRoutes.get("/", (req, res) => {
  res.json({ teste: "teste" });
});
// productsRoutes.use(userAuth)
productsRoutes.post(
  "/",userAuth,
  upload.fields([{ name: "image" }, { name: "pdf" },{name:"video"}]),validated(productSchema),
  productsController.create
);
