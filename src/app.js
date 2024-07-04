import express from "express";
import ProductManager from "./class/productManager.js";
import CartManager from "./Class/cartManager.js";
import { __dirname } from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(__dirname + "/data/product.json");
const cartManager = new CartManager(__dirname + "/data/cart.json");

// Rutas para los productos
app.get("/api/products", async (req, res) => {
  const { limit } = req.query;
  try {
    let productList = await productManager.getProductList();
    if (limit) {
      productList = productList.slice(0, limit);
    }
    res.status(200).json({ resultado: productList });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos.', error: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json({ resultado: product });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto.', error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const newProduct = req.body;
  
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = newProduct;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Todos los campos son requeridos, excepto thumbnails y status.' });
  }

  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto añadido!' });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el producto.', error: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  try {
    const product = await productManager.updateProduct(pid, updatedProduct);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto actualizado!', producto: product });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto.', error: error.message });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  
  try {
    const product = await productManager.deleteProduct(pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto eliminado!' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: error.message });
  }
});

// Ruta carrito
app.post("/api/carts", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({ message: 'Carrito creado!', carrito: cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito.', error: error.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }
    res.status(200).json({ carrito: cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito.', error: error.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado.' });
    }
    res.status(200).json({ message: 'Producto añadido al carrito!', carrito: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el producto al carrito.', error: error.message });
  }
});

app.listen(8080, () => {
  console.log("servidor ON");
});