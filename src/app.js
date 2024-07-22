import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import { create } from 'express-handlebars';
import productManager from './Class/productManager.js';
import homeRouter from './Routes/home.router.js';
import realTimeProductsRouter from './Routes/realTimeProducts.router.js';
import handlebarsLayouts from 'handlebars-layouts';
import Handlebars from 'handlebars';


const productManagerInstance = new productManager(__dirname + '/Data/product.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/Views/css'));

//  Handlebars // 
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',

    helpers: {
        ...handlebarsLayouts(Handlebars)
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


// Usar las rutas
app.use('/', homeRouter);
app.use('/realTimeProducts', realTimeProductsRouter);


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('requestProducts', async () => {
        try {
            const products = await productManagerInstance.getProductList();
            socket.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            socket.emit('error', 'No se pudo obtener la lista de productos');
        }
    });

    socket.on('addProduct', async (product) => {
        try {
            await productManagerInstance.addProduct(product);
            const products = await productManagerInstance.getProductList();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('error', 'No se pudo agregar el producto');
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            await productManagerInstance.deleteProduct(id);
            const products = await productManagerInstance.getProductList();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            socket.emit('error', 'No se pudo eliminar el producto');
        }
    });

    socket.on('updateProduct', async (id, updatedProduct) => {
      await productManager.updateProduct(id, updatedProduct);
      const products = await productManager.getProductList();
      io.emit('updateProducts', products);
  });
});

httpServer.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});