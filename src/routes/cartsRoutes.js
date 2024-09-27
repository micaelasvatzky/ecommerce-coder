import {Router } from "express";
import { userRoleMiddleware } from "../middlewares/userRoleMiddleware.js";
import { CartManager } from "../managers/CartManager.js";
import { ProductManager } from "../managers/ProductManager.js";
const router = Router();

const cartManager = new CartManager(); 
const productManager = new ProductManager();

router.get("/",userRoleMiddleware, async (req, res) => {

    const carts = await cartManager.getCarts();

    res.status(200).json({status: "ok", payload: carts});

});

//los middleware se meten en archivos y se los exporta para dsp poder usarlos
router.post("/", userRoleMiddleware, async (req, res) => {
  const newCart = await cartManager.createCart(); 
  res.status(201).json({ status: "ok", payload: newCart });
});

router.get("/:cid", userRoleMiddleware, async (req, res) =>{

    const { cid } = req.params;
    const cart = await cartManager.getCartById(Number(cid));
  
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Cart not Found" });
  
    res.status(200).json({ status: "ok", payload: cart });

});

router.post("/:cid/products/:pid", async (req,res) => { 
  const { cid, pid } = req.params;
  // const body = req.body;
  const product =  await productManager.getProductById(Number(pid));

  if(!product)  return res.status(404).json({ status: "error", message: "Product not found" });
   console.log(product)

  await cartManager.addProductToCart(cid, pid);

  res.status(200).json({status:"ok", payload:`Product ${pid} added to cart`});

})

export default router;

