import fs from 'node:fs/promises';

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getCarts() {
    const list = await fs.readFile(this.path, 'utf-8');
    this.carts = JSON.parse(list).data;
    return this.carts;
  }

  async getCartById(id) {
    await this.getCarts();
    return this.carts.find(cart => cart.id === id);
  }

  async createCart() {
    await this.getCarts();
    const newCart = {
      id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: [],
    };
    this.carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify({ data: this.carts }));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    await this.getCarts();
    const cartIndex = this.carts.findIndex(cart => cart.id === parseInt(cid));
    if (cartIndex === -1) return null;

    const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === parseInt(pid));
    if (productIndex === -1) {
      this.carts[cartIndex].products.push({ id: parseInt(pid), quantity: 1 });
    } else {
      this.carts[cartIndex].products[productIndex].quantity += 1;
    }

    await fs.writeFile(this.path, JSON.stringify({ data: this.carts }));
    return this.carts[cartIndex];
  }
}

export default CartManager;