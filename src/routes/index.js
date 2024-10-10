import {Router } from "express";
import productsRoutes from "./productsRoutes.js";
import cartsRoutes from "./cartsRoutes.js";
import viewRoutes from "./viewRoutes.js";
import { userRoleMiddleware } from "../middlewares/userRoleMiddleware.js";

const router = Router();

router.use("/carts", cartsRoutes);
//Middleware a nivel router

router.use("/products", productsRoutes);

router.use("/", viewRoutes);


router.use(userRoleMiddleware);


export default router;