import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';

import ProductManager from './managers/ProductManager.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';

// Configuración para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

const app = express();
const PORT = 8080;

// Servidor HTTP y Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // para JS/CSS en vistas

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta HOME
app.get('/', async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render('home', {
      titulo: 'Bienvenido/a a Reset Store',
      productos,
    });
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    res.status(500).send('Error al cargar productos');
  }
});

// Ruta realtimeproducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    titulo: 'Productos en tiempo real',
  });
});

// WebSockets
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por websocket');

  // Ejecutar lógica async dentro de una función interna
  (async () => {
  const productos = await productManager.getProducts();
  socket.emit('productosActualizados', productos);
  })();

  // Agregar producto desde formulario
  socket.on('nuevoProducto', async (producto) => {
    console.log('📦 Nuevo producto recibido:', producto);

    await productManager.addProduct(producto);
    const productosActualizados = await productManager.getProducts();
    io.emit('productosActualizados', productosActualizados);
  });

  // Eliminar producto desde botón
  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id);
    const productosActualizados = await productManager.getProducts();
    io.emit('productosActualizados', productosActualizados);
  });
});

// Levantar servidor
httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});