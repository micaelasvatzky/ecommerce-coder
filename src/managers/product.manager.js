import ProductModel from "../models/product.model.js";

export class ProductManager {
  constructor() {
    this.products = [];
  }

  async getProducts() {
    try {
      const products = await ProductModel.find().lean();
      return products;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error("Error al obtener todos los productos");
    }
  }

  async getProductById(id) {
    try {
      const productById = await ProductModel.findById(id).lean();
      if (!productById) {
        throw new Error("Producto no encontrado");
      }
      return productById;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async addProduct(product) {
    try {
      const newProduct = new ProductModel(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error("Error al crear un nuevo producto");
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }
      return updatedProduct;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }
      return deletedProduct;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw new Error("Error al eliminar el producto");
    }
  }
}

export default ProductManager;