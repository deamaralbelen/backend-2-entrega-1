import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';

import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import usersRouter from './routes/users.routes.js';
import sessionsRouter from './routes/sessions.routes.js';

// Conexión con MongoDB

mongoose.connect('mongodb://localhost:27017/backend-1-proyecto-final')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB', err));

// Configuración para __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Servidor HTTP y Socket.IO

const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars

app.engine('handlebars', exphbs.engine({
  helpers: {
    eq: (a, b) => a === b,
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }
}
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Middleware base

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // para JS/CSS en vistas

// Passport

initializePassport();
app.use(passport.initialize());

// Rutas vistas

app.use('/', viewsRouter);

// Rutas API

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Nuevas rutas

app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// WebSockets

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por websocket');

  (async () => {
    const productos = await Product.find().lean();
    socket.emit('productosActualizados', productos);
  })();

  socket.on('nuevoProducto', async (producto) => {
    console.log('📦 Nuevo producto recibido:', producto);
    await Product.create(producto);
    const productosActualizados = await Product.find().lean();
    io.emit('productosActualizados', productosActualizados);
  });

  socket.on('eliminarProducto', async (id) => {
    await Product.findByIdAndDelete(id);
    const productosActualizados = await Product.find().lean();
    io.emit('productosActualizados', productosActualizados);
  });
});

// Levantar servidor

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});