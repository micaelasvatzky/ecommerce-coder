import { Router } from "express";
const router = Router();

//Importar el product manager y llamamos al metodo que corresponda
import ProductManager from "../managers/product.manager.js";
const productsManager = new ProductManager();

import CartManager from "../managers/cart.manager.js";
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    const productos = await productsManager.getProducts();
    res.render("home", {productos});
});

router.get("/products/:pid", async(req, res) => {
    const { pid } = req.params;
    const product = await productsManager.getProductById(pid);
    res.render('product', { product });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.render('cart', { cart });
  });
  

router.get("/realtimeproducts", async (req, res) => {
    const productos = await productsManager.getProducts();
    res.render("realTimeProducts", {productos});
});


export default router;