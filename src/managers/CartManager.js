import fs from "fs";
import __dirname from "../../dirname.js";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager();

export class CartManager {
  constructor() {
    this.carts = [];
    this.pathFile = __dirname + "/src/managers/data/carts.json";
    //__dirname: path completo de donde esta guardado el archivo
  }

  async getCarts() {
    try {
      const cartsJson = await fs.promises.readFile(this.pathFile, "utf-8");
      const cartsParse = JSON.parse(cartsJson);
      this.carts = cartsParse || [];
      return this.carts;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async createCart() {
    await this.getCarts();

    const newCart = {
      id: this.carts.length + 1,
      products: [],
    };

    this.carts.push(newCart);
    await fs.promises.writeFile(this.pathFile, JSON.stringify(this.carts));
    return this.carts;
  }

  async getCartById(id) {
    try {
      await this.getCarts(); //primero llama a los productos, dsp los busca por id

      const findCart = this.carts.find((cart) => cart.id === Number(id));

      if (!findCart) throw new Error("Product not found");

      return findCart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async updateCart(updatedCart) {
    const cartIndex = this.carts.findIndex(
      (cart) => cart.id === updatedCart.id
    );
    if (cartIndex !== -1) {
      this.carts[cartIndex] = updatedCart;
      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.carts));
    }
  }

  async addProductToCart(cid, pid) {
    try {
      await this.getCarts();
      const cart = this.carts.find((cart) => cart.id === Number(cid));
      if (!cart) throw new Error("Cart not found");

      const productIndex = cart.products.find((p )=> p.id === Number(pid)); // Ver si el producto existe en el carrito
      console.log(productIndex);

      if (productIndex) {
        productIndex.quantity += 1;
      } else {
        cart.products.push({
          product: Number(pid), // Solo el ID del producto
          quantity: 1,
        });
      }

      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.carts));
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

const carts = new CartManager();
