import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  const result = await productManager.addProduct(newProduct);
  res.status(201).json(result);
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updateData = req.body;
  const result = await productManager.updateProduct(parseInt(pid), updateData);
  res.json(result);
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const result = await productManager.deleteProduct(parseInt(pid));
  res.json(result);
});

export default router;