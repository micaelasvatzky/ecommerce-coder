import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

//Primero llamamos al router y lo ejecutamos
const router = Router();

//router funciona igual que app con get, post,etc

const productsManager = new ProductManager(); 


router.get("/", async (req, res) => {
    const products = await productsManager.getProducts();
    res.status(200).json({ status: "ok", payload: products });
    //Envía estado que Esta todo ok y otra respuesta, payload es la respuesta que se envía (el array en este caso)
  });
  
  router.post("/", async (req,res) => { 
    const body = req.body; 
    
    const products = await productsManager.addProduct(body);

    res.status(201).json({status:"ok", payload:products});
});
  
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await productsManager.getProductById(Number(pid));
  
    if (!product)
      return res
        .status(404)
        .json({ status: "error", message: "Product Not Found" });
  
    res.status(200).json({ status: "ok", payload: product });
  });
  
router.put("/:pid", async (req, res) =>{
    const { pid } = req.params;
    const updatedProductData = req.body;
  
    const updateProduct = await productsManager.updateProduct(Number(pid), updatedProductData);
  
    res.status(200).json({status: "ok", message: "Product Updated"});
  
  });
  
router.delete("/:pid", async (req, res) =>{
    const { pid } = req.params;
    const product = await productsManager.deleteProduct(Number(pid));
  
    if (product)
      return res
        .status(404)
        .json({ status: "error", message: "Could not delete product" });
  
    res.status(200).json({ status: "ok", message: "Product Not Found"});
  });
  
export default router;
