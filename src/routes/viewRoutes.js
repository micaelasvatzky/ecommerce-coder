import { Router } from "express";
const router = Router();

//Importar el product manager y llamamos al metodo que corresponda
import { ProductManager } from "../managers/ProductManager.js";
const productsManager = new ProductManager();

router.get("/product", async (req, res) => {
    const productos = await productsManager.getProducts();
    //Recupero los productos del json y se los tengo q enviar a la vista home

    res.render("home", {productos});
    //Renderizamos la vista home y a la vez le enviamos un array con todos los productos del inventario

    //Tambien se puede trabajar con un try-catch para capturar algun error
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});


export default router;