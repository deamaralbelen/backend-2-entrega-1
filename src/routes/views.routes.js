import { Router } from 'express';
import { Product } from '../models/product.model.js';
import { Cart } from '../models/cart.model.js';

const router = Router();

// Ruta HOME con paginación, filtro, orden

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'disponible') {
        filter.stock = { $gt: 0 };
      } else {
        filter.$or = [
          { category: query },
          { title: { $regex: query, $options: 'i' } }
        ];
      }
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get('host')}/`;

    res.render('home', {
      titulo: 'Bienvenido/a a Reset Store',
      productos: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
      query,
      sort
    });
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    res.status(500).render('error', { message: 'Error al cargar productos' });
  }
});

// Ruta detalle producto

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }

    res.render('productDetail', {
      titulo: product.title,
      producto: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al cargar el producto' });
  }
});

// Ruta vista carrito

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    res.render('cartDetail', {
      titulo: 'Detalle del Carrito',
      carrito: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Error al cargar el carrito' });
  }
});

// Ruta realtimeproducts

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    titulo: 'Productos en tiempo real',
  });
});

export default router;