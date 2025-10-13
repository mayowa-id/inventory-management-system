import { PurchaseOrder, Product, Warehouse, WarehouseProduct, sequelize } from '../models/index.js';
import { addDays } from '../utils/date.js';

/**
 * Create a purchase order with warehouse capacity check and expectedArrival calculation.
 * If warehouse capacity is insufficient, the order quantity will be reduced to available space.
 * If there's no available space, a Purchase Order is created with status 'ALERT' and quantityOrdered = 0.
 *
 * @param {Object} opts
 * @param {number} opts.productId
 * @param {number|null} opts.supplierId
 * @param {number} opts.warehouseId
 * @param {number} opts.quantityOrdered
 * @param {number} [opts.leadTimeDays=3]
 */
export async function createPurchaseOrder({ productId, supplierId = null, warehouseId, quantityOrdered, leadTimeDays = Number(process.env.LEAD_TIME_DAYS || 3) }) {
  if (!productId || !warehouseId || typeof quantityOrdered !== 'number') {
    throw new Error('productId, warehouseId and numeric quantityOrdered are required');
  }

  return await sequelize.transaction(async (tx) => {
    const product = await Product.findByPk(productId, { transaction: tx });
    if (!product) throw new Error('Product not found');

    const warehouse = await Warehouse.findByPk(warehouseId, { transaction: tx });
    if (!warehouse) throw new Error('Warehouse not found');

    // current sum of items in warehouse
    const currentSum = await WarehouseProduct.sum('quantity', { where: { warehouseId }, transaction: tx }) || 0;
    const available = Math.max(0, warehouse.capacity - currentSum);

    if (available <= 0) {
      const po = await PurchaseOrder.create({
        productId,
        supplierId,
        warehouseId,
        quantityOrdered: 0,
        orderDate: new Date(),
        expectedArrivalDate: addDays(new Date(), leadTimeDays),
        status: 'ALERT'
    }, { transaction: tx });

      return { po, alert: true, reason: 'warehouse_full' };
    }

    const finalQty = Math.min(quantityOrdered, available);

    const po = await PurchaseOrder.create({
      productId,
      supplierId,
      warehouseId,
      quantityOrdered: finalQty,
      orderDate: new Date(),
      expectedArrivalDate: addDays(new Date(), leadTimeDays),
      status: 'PENDING'
    }, { transaction: tx });

    const reduced = finalQty < quantityOrdered;

    return { po, reduced, availableBeforeOrder: available };
  });
}

/**
 * List purchase orders (simple wrapper)
 * @param {Object} [opts]
 * @param {string} [opts.status] filter by status
 */
export async function listPurchaseOrders({ status } = {}) {
  const where = {};
  if (status) where.status = status;
  return await PurchaseOrder.findAll({ where, order: [['orderDate', 'DESC']] });
}

/**
 * Mark a purchase order as arrived/completed. This will add the ordered quantity to the warehouse inventory.
 * @param {number} poId
 */
export async function markPurchaseOrderArrived(poId) {
  return await sequelize.transaction(async (tx) => {
    const po = await PurchaseOrder.findByPk(poId, { transaction: tx });
    if (!po) throw new Error('Purchase order not found');
    if (po.status === 'COMPLETED') throw new Error('Purchase order already completed');

    const qty = Number(po.quantityOrdered || 0);

    if (qty > 0) {
      const wp = await WarehouseProduct.findOne({ where: { productId: po.productId, warehouseId: po.warehouseId }, transaction: tx });
      if (wp) {
        wp.quantity = wp.quantity + qty;
        await wp.save({ transaction: tx });
      } else {
        await WarehouseProduct.create({ productId: po.productId, warehouseId: po.warehouseId, quantity: qty }, { transaction: tx });
      }
    }

    po.status = 'COMPLETED';
    await po.save({ transaction: tx });

    return po;
  });
}
