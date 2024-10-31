import { Router } from "express";
import { ProductManager } from "../managers/product.manager.js";
import ProductModel from "../models/product.model.js";

//Primero llamamos al router y lo ejecutamos
const router = Router();

//router funciona igual que app con get, post,etc

const productsManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    //const query = req.query.query|| "";
    const sort = req.query.sort === "desc" ? -1 : 1;
    //const filter = query ? { category: query } : {};

    const query = {};
    if (req.query.query) {
      query.category = req.query.query; // Filtrar por categoría
    }
    if (req.query.availability) {
      query.status = req.query.availability === "true"; // Filtrar por disponibilidad (booleano)
    }

    const productsPaginate = await ProductModel.paginate(
      query, 
      {
        limit,
        page,
        sort: { price: sort }, 
      }
    );

    const productsRecuperados = productsPaginate.docs.map((product) => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    const prevLink = productsPaginate.hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
    const nextLink = productsPaginate.hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;

    res.status(200).json({
      status: "ok",
      payload: productsRecuperados,
      totalPages: productsPaginate.totalPages,
      prevPage: productsPaginate.prevPage,
      nextPage: productsPaginate.nextPage,
      page: productsPaginate.page,
      hasPrevPage: productsPaginate.hasPrevPage,
      hasNextPage: productsPaginate.hasNextPage,
      nextLink: nextLink,
      prevLink: prevLink
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  const body = req.body;

  if (
    !body.title ||
    !body.desc ||
    !body.price ||
    !body.code ||
    !body.stock ||
    !body.category ||
    typeof body.status !== "boolean"
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Todos los campos son requeridos" });
  }
  const products = await productsManager.addProduct(body);

  res.status(201).json({ status: "ok", payload: products });
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.getProductById(pid);

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product Not Found" });

  res.status(200).json({ status: "ok", payload: product });
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProductData = req.body;

  const updateProduct = await productsManager.updateProduct(
    pid,
    updatedProductData
  );

  res.status(200).json({ status: "ok", message: "Product Updated" });
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await productsManager.deleteProduct(pid);
    return res.status(200).json({
      status: "ok",
      message: "Producto eliminado correctamente",
      payload: deletedProduct,
    });
  } catch (error) {
    // Manejo de errores
    if (error.message === "Producto no encontrado") {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }
  }
});

export default router;
