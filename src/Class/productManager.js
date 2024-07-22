import fs from "fs/promises";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProductList() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getProductList();
    product.id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async deleteProduct(id) {
    let products = await this.getProductList();
    products = products.filter((product) => product.id !== parseInt(id, 10));
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async updateProduct(id, updatedProduct) {
    let products = await this.getProductList();
    const index = products.findIndex(
      (product) => product.id === parseInt(id, 10)
    );
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedProduct };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async getProductById(id) {
    const products = await this.getProductList();
    return products.find((product) => product.id === parseInt(id, 10));
  }
}
