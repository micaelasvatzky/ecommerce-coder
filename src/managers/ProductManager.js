import fs from "fs";
import __dirname from "../../dirname.js";

export class ProductManager {
  constructor() {
    this.products = [];
    this.pathFile = __dirname + "/src/managers/data/products.json";
    //__dirname: path completo de donde esta guardado el archivo
  }

  async getProducts() {
    try {
      const productsJson = await fs.promises.readFile(this.pathFile, "utf-8");
      const productsParse = JSON.parse(productsJson);
      this.products = productsParse || [];
      return this.products;
      //console.log(this.products);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      await this.getProducts(); //primero llama a los productos, dsp los busca por id

      const findProduct = this.products.find(
        (product) => product.id === Number(id)
      );

      if (!findProduct) throw new Error("Product not found");

      return findProduct;

      console.log(findProduct);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async addProduct(product) {
    try {

      await this.getProducts();
      
      const { title, desc, price, thumbnail, code, stock, category, status } = product; //se desestructura para usar solo la info necesaria

      const newProduct = {
        id: this.products.length + 1,
        title,
        desc,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
      };

      const productExist = this.products.find(
        (product) => product.code === code
      );

      if (productExist)
        throw new Error(`"Error: El producto con el codigo ${code} ya existe`);

      const arrayValues = Object.values(newProduct);

      if (arrayValues.includes(undefined))
        throw new Error("Error: Todos los datos son obligatorios");

      this.products.push(newProduct);

      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));

      return this.products;

    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      await this.getProducts();

      const index = this.products.findIndex((product) => product.id === id); //Si no encuentra el elemento que coincide, devuelve un -1

      if (index == -1) throw new Error("Error: Product not found");

      this.products[index] = {
        ...this.products[index], //Copiamos todos los valores originales
        ...productData, //Sobreescribimos los nuevos valores
      };

      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));

      console.log(this.products[index]);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      await this.getProducts();

      await this.getProductById(id);
      
      this.products = this.products.filter((product) => product.id !== id);
      //filtra todos los que no tienen el id que se pasó, se guarda en this.products

      await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products));
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

//como se almacena todo en la misma clase, no hace falta hacer una instancia para cada objeto
const products = new ProductManager();

//products.getProducts();

/*products.addProduct({
  title: "Producto 1",
  desc: "Descripcion del producto 1",
  price: 100,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png",
  code: "ABc122",
  stock: 10,
  category: "Ropa",
  status: true
});

products.addProduct({
  title: "Producto 2",
  desc: "Descripcion del producto 1",
  price: 200,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png",
  code: "ABc123",
  stock: 5,
  category: "Ropa",
  status: true,
});

products.addProduct({
  title: "Producto 3",
  desc: "Descripcion del producto 1",
  price: 200,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/bus-vehicle-transport-school-128.png",
  code: "ABc124",
  stock: 5,
  category: "Ropa",
  status: true
});
*/
//products.getProductById(2);
//products.updateProduct(2, {title: "Nuevo título", price: 999});
//products.deleteProduct(2);
