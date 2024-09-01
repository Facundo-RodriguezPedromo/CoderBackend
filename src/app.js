import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'express-handlebars';
import mongoose from 'mongoose';
import {ProductModel} from './Models/productModel.js';
import {CartModel} from './Models/cartModel.js';

//import routesGeneral from './Routes/routesGeneral.js';
import rutaCart from './Routes/cart.router.js';
import rutaHome from './Routes/home.router.js';
import routaRealTime from './Routes/realTimeProducts.router.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Resolviendo el path del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

// Configuración de Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'Views', 'layouts')
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'Views'));

// Rutas
//app.use('/cart', rutaCart);
app.use('/', rutaHome);
app.use('/cart', rutaCart);
app.use('/realTimeProducts', routaRealTime);

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('requestProducts', async () => {
        try {
            const products = await ProductModel.find();
            socket.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            socket.emit('error', 'No se pudo obtener la lista de productos');
        }
    });

    socket.on('addProductToCart', async ({ productId }) => {
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                socket.emit('error', 'Producto no encontrado');
                return;
            }

            let cartItem = await CartModel.findOne({ 'product._id': product._id });
            if (cartItem) {
                cartItem.product.quantity += 1;
                await cartItem.save();
            } else {
                cartItem = await CartModel.create({
                    product: {
                        ...product.toObject(),
                        quantity: 1
                    }
                });
            }

            const cartItems = await CartModel.find();
            io.emit('updateCart', cartItems.map(item => item.product));
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            socket.emit('error', 'No se pudo agregar el producto al carrito');
        }
    });

    socket.on('addProduct', async (product) => {
        try {
            const newProduct = new ProductModel(product);
            await newProduct.save();
            const products = await ProductModel.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('error', 'No se pudo agregar el producto');
        }
    });

    socket.on('deleteProduct', async (codeID) => {
        try {
            const product = await ProductModel.findOne({ code: codeID });
            if (!product) {
                socket.emit('error', 'Producto no encontrado');
                return;
            }
            await ProductModel.deleteOne({ code: codeID });
            await CartModel.deleteMany({ product: product._id });

            const products = await ProductModel.find();
            io.emit('updateProducts', products);

            const cartItems = await CartModel.find().populate('product');
            io.emit('updateCart', cartItems.map(item => ({ ...item.product.toObject(), quantity: item.quantity })));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            socket.emit('error', 'No se pudo eliminar el producto');
        }
    });

    socket.on('requestCartItems', async () => {
        try {
            const cartItems = await CartModel.find();
            socket.emit('updateCart', cartItems.map(item => item.product));
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            socket.emit('error', 'No se pudo obtener la lista de productos del carrito');
        }
    });

    socket.on('updateProduct', async (id, updatedProduct) => {
        try {
            await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
            const products = await ProductModel.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            socket.emit('error', 'No se pudo actualizar el producto');
        }
    });
});

// Conexion a MongoDB
mongoose.connect(
    'mongodb+srv://facundorodriguez7714:abuenoqueTEPASA123@cluster0.kog9u.mongodb.net/Entrega3?retryWrites=true&w=majority',
    { dbName: 'Entrega3' }
)
.then(() => {
    console.log('Conectado a la base de datos Entrega 3 - MongoDB');
})
.catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
});

httpServer.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});
