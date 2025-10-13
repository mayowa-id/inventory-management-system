import { Product, WarehouseProduct, Supplier } from '../models/index.js';
import * as purchaseOrderService from './purchaseOrder.service.js';

/**
 * Create a product
 * @param {Object} data
 */export async function createProduct(data) {
  const { sku, name, description = '', reorderThreshold = 0, defaultSupplierId = null } = data;

  if (!sku || !name) {
    throw new Error('sku and name are required');
  }

  // verify supplier exists
  if (defaultSupplierId) {
    const supplier = await Supplier.findByPk(defaultSupplierId);
    if (!supplier) throw new Error(`Supplier ${defaultSupplierId} not found`);
  }

  const product = await Product.create({
    sku,
    name,
    description,
    reorderThreshold,
    defaultSupplierId
  });

  return product;
}


/**
 * List products with optional warehouse stock included
 * If warehouseId provided, add quantity from warehouse_products
 * @param {Object} opts
 * @param {number} [opts.warehouseId]
 */
export async function listProducts({ warehouseId } = {}) {
  const products = await Product.findAll();
  const results = [];

  for (const p of products) {
    let quantity = null;
    if (warehouseId) {
      const wp = await WarehouseProduct.findOne({ where: { productId: p.id, warehouseId } });
      quantity = wp ? wp.quantity : 0;
    } else {
      // total across warehouses
      const sum = await WarehouseProduct.sum('quantity', { where: { productId: p.id } });
      quantity = sum || 0;
    }

    // include supplier info if exists
    const supplier = p.defaultSupplierId ? await Supplier.findByPk(p.defaultSupplierId) : null;

    results.push({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      reorderThreshold: p.reorderThreshold,
      defaultSupplier: supplier ? { id: supplier.id, name: supplier.name } : null,
      quantity
    });
  }

  return results;
}

/**
 * Adjust stock for a product in a specific warehouse (delta can be negative)
 * This function will:
 *  - update/create warehouse_products row
 *  - if new quantity < reorderThreshold, trigger auto reorder
 *
 * @param {number} productId
 * @param {number} warehouseId
 * @param {number} delta
 */
export async function adjustStock({ productId, warehouseId, delta }) {
  if (!productId || !warehouseId || typeof delta !== 'number') {
    throw new Error('productId, warehouseId and numeric delta are required');
  }

  // upsert warehouse product row
  const [wp, created] = await WarehouseProduct.findOrCreate({ where: { productId, warehouseId }, defaults: { quantity: 0 } });
  wp.quantity = Math.max(0, wp.quantity + delta);
  await wp.save();

  // check reorder
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('product not found');

  if (wp.quantity < product.reorderThreshold) {
    const needed = product.reorderThreshold - wp.quantity;
    // attempt to create PO using default supplier
    const supplierId = product.defaultSupplierId || null;
    // createPurchaseOrder will handle capacity checks and may reduce quantity
    const result = await purchaseOrderService.createPurchaseOrder({
      productId,
      supplierId,
      warehouseId,
      quantityOrdered: needed
    });
    return { wp, reorder: result };
  }

  return { wp, reorder: null };
}

/**
 * Get single product info (with total or per-warehouse quantity)
 */
export async function getProductById(id, { warehouseId } = {}) {
  const p = await Product.findByPk(id);
  if (!p) return null;
  let quantity;
  if (warehouseId) {
    const wp = await WarehouseProduct.findOne({ where: { productId: id, warehouseId } });
    quantity = wp ? wp.quantity : 0;
  } else {
    quantity = (await WarehouseProduct.sum('quantity', { where: { productId: id } })) || 0;
  }
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    description: p.description,
    reorderThreshold: p.reorderThreshold,
    defaultSupplierId: p.defaultSupplierId,
    quantity
  };
}
