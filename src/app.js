import express from "express";
import { ProductManager } from "./managers/ProductManager.js";

const app = express();

//Middlewares
app.use(express.json()); //Nos permite leer archivo json
app.use(express.urlencoded({ extended: true }));

let products = [];

const productsManager = new ProductManager;

app.get("/api/products", async (req, res) => {
  const products = await productsManager.getProducts();
  res.status(200).json({ status: "ok", payload: products });
  //Envía estado que Esta todo ok y otra respuesta, payload es la respuesta que se envía (el array en este caso)
});

app.post("/api/products", (req, res) => {
  const body = req.body; //el body de lo que envia el cliente
  const newProduct = {
    id: products.length + 1,
    ...body,
  };
  products.push(newProduct);
  res.status(201).json({ status: "ok", payload: products }); //estado: se creó bien la petición
});

app.get("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsManager.getProductById(Number(pid));

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product Not Found" });

  res.status(200).json({ status: "ok", payload: product });
});

app.listen(8080, () => {
  console.log("Server on port 8080");
});
