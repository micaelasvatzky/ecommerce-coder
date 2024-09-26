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

router.post("/:cid/product/:pid", userRoleMiddleware, async (req, res) => {
    const { cid, pid } = req.params;

    const product = await productManager.getProductById(Number(pid));
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const cart = await cartManager.getCartById(Number(cid));
    if(!cart) {
        return res.status(404).json({message: "Cart not found"});
    }

    const productIndex = cart.products.findIndex(p => p.product === Number(pid)); // Ver si el producto existe en el carrito

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({
        product: Number(pid), // Solo el ID del producto
        quantity: 1
      });
    }

    await cartManager.updateCart(cart);
    res.json({ message: "Product added to cart", cart });

  });

export default router;