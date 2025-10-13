import * as productService from '../services/products.service.js';

export async function listProducts(req, res) {
  try {
    const warehouseId = req.query.warehouseId ? Number(req.query.warehouseId) : undefined;
    const products = await productService.listProducts({ warehouseId });
    res.json(products);
  } catch (err) {
    console.error('listProducts error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const warehouseId = req.query.warehouseId ? Number(req.query.warehouseId) : undefined;
    const product = await productService.getProductById(id, { warehouseId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('getProduct error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createProduct(req, res) {
  try {
    const data = req.body;
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error', err);
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
}

export async function adjustStock(req, res) {
  try {
    const productId = Number(req.params.id);
    const { warehouseId, delta } = req.body;

    if (!warehouseId || typeof delta !== 'number') {
      return res.status(400).json({ error: 'warehouseId and numeric delta required' });
    }

    const result = await productService.adjustStock({ productId, warehouseId, delta });
    res.json(result);
  } catch (err) {
    console.error('adjustStock error', err.stack);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
