import { Router } from "express";
import mongoose from "mongoose";
import { userRoleMiddleware } from "../middlewares/userRoleMiddleware.js";
import CartManager from "../managers/cart.manager.js";
import { ProductManager } from "../managers/product.manager.js";
const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();

  res.status(200).json({ status: "ok", payload: carts });
});

//los middleware se meten en archivos y se los exporta para dsp poder usarlos
router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json({ status: "ok", payload: newCart });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);

  if (!cart)
    return res.status(404).json({ status: "error", message: "Cart not Found" });

  res.status(200).json({ status: "ok", payload: cart });
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  console.log(cid, pid);

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: "error", message: "ID no válido" });
  }

  const product = await productManager.getProductById(pid);

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  console.log(product);

  await cartManager.addProductToCart(cid, pid);

  res
    .status(200)
    .json({ status: "ok", payload: `Product ${pid} added to cart` });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ status: "error", message: "ID no válido" });
  }

  const product = await productManager.getProductById(pid);

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  console.log(product);

  await cartManager.deleteProductFromCart(cid, pid);
  res
    .status(200)
    .json({ status: "ok", payload: `Product ${pid} deleted from cart` });
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Se requiere un arreglo de productos",
      });
  }

  try {
    const cart = await cartManager.updateCart(cid, products);

    res.status(200).json({
      status: "ok",
      payload: cart,
      message: "Carrito actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity;

  try {
    const cart = await cartManager.updateProductQuantity(
      cid,
      pid,
      Number(quantity)
    );

    res.status(200).json({
      status: "ok",
      payload: cart,
      message: "Carrito actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.deleteAllProductsFromCart(cid);
    res.status(200).json({
      status: "ok",
      payload: cart,
      message: "Carrito actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
