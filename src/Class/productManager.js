import fs from 'node:fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productList = [];
  }

  async getProductList() {
    const list = await fs.readFile(this.path, 'utf-8');
    this.productList = JSON.parse(list).data;
    return this.productList;
  }

  async getProductById(id) {
    await this.getProductList();
    return this.productList.find(product => product.id === id);
  }

  async addProduct(product) {
    await this.getProductList();
    const newProduct = {
      ...product,
      id: this.productList.length ? this.productList[this.productList.length - 1].id + 1 : 1,
      status: product.status ?? true,
    };
    this.productList.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify({ data: this.productList }));
    return newProduct;
  }

  async updateProduct(id, updatedProduct) {
    await this.getProductList();
    const index = this.productList.findIndex(product => product.id === id);
    if (index === -1) return null;
    this.productList[index] = { ...this.productList[index], ...updatedProduct, id };
    await fs.writeFile(this.path, JSON.stringify({ data: this.productList }));
    return this.productList[index];
  }

  async deleteProduct(id) {
    await this.getProductList();
    const index = this.productList.findIndex(product => product.id === id);
    if (index === -1) return null;
    const deletedProduct = this.productList.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify({ data: this.productList }));
    return deletedProduct[0];
  }
}

export default ProductManager;