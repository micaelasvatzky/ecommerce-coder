import {Router } from "express";
import { userRoleMiddleware } from "../middlewares/userRoleMiddleware.js";
import { CartManager } from "../managers/CartManager.js";
const router = Router();

const cartManager = new CartManager(); 

router.get("/",userRoleMiddleware, async (req, res) => {

    const carts = await cartManager.getCarts();

    res.status(200).json({status: "ok", payload: carts});

});

//los middleware se meten en archivos y se los exporta para dsp poder usarlos
router.post("/", userRoleMiddleware, async (req, res) => {
    const body = req.body; 
    
    const productsArray = await cartManager.addProductsToCart(body);

    res.status(201).json({status:"ok", payload: productsArray});
});

router.get("/:cid", userRoleMiddleware, async (req, res) =>{

    const { cid } = req.params;
    const cart = await cartManager.getCartById(Number(cid));
  
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Cart Not Found" });
  
    res.status(200).json({ status: "ok", payload: cart });

});

router.get("/:cid/product/:pid", userRoleMiddleware, (req, res) => {
    

});

export default router;