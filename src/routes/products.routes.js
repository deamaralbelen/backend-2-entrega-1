import { Router } from 'express';
import { Product } from '../models/product.model.js';

const router = Router();

// GET /api/products?limit=&page=&sort=&query=

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'disponible') filter.stock = { $gt: 0 };
      else filter.category = query;
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true
    };

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get('host')}/api/products`;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/products/:pid

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/products

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await Product.create(newProduct);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/products/:pid

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;
    const result = await Product.findByIdAndUpdate(pid, updateData, { new: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/products/:pid

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await Product.findByIdAndDelete(pid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;