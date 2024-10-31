import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export class CartManager {
  constructor() {
    this.carts = [];
  }

  async getCarts() {
    try {
      const carts = await CartModel.find().lean(); // Trae todos los carritos y los convierte en objetos planos
      return carts;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const newCart = new CartModel({
        products: [],
      });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id).populate("products.product").lean();
      if (!cart) throw new Error("Cart not found");
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async updateCart(updatedCart) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        updatedCart._id,
        updatedCart,
        { new: true }
      );
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      const product = await ProductModel.findById(pid);
      if (!product) throw new Error("Product not found");

      const productInCart = cart.products.find((p) => p.product.equals(pid));

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      try {
        await cart.save(); // Guardar cambios en el carrito
        console.log("Cart updated:", cart); // Verificar el carrito actualizado
      } catch (saveError) {
        console.log(`Save error: ${saveError.message}`);
        throw new Error("Could not save the cart");
      }
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      const product = await ProductModel.findById(pid);
      if (!product) throw new Error("Product not found");

      cart.products = cart.products.filter((p) => !p.product.equals(pid));

      await cart.save();
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async deleteAllProductsFromCart(cid){
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      cart.products = [];

      await cart.save();

    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async updateCart(cid, newProducts) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) throw new Error("Carrito no encontrado");
  
      cart.products = newProducts.map((item) => ({
        product: item.product,  
        quantity: item.quantity 
      }));

      await cart.save();
  
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid);
      if (!cart) throw new Error("Carrito no encontrado");

      const product = await ProductModel.findById(pid);
      if (!cart) throw new Error("Carrito no encontrado");
      
      const productInCart = cart.products.find((p) => p.product.equals(pid));

      productInCart.quantity = Number(quantity);
      
      
      await cart.save();
  
      return cart;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      throw error;
    }
  }
}

export default CartManager;
