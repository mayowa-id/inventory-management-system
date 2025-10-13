import { PurchaseOrder, WarehouseProduct, sequelize } from '../models/index.js';

export async function createPurchaseOrder(req, res) {
  try {
    const { productId, warehouseId, supplierId, quantityOrdered, orderDate } = req.body;

    if (!productId || !warehouseId || !supplierId || !quantityOrdered) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = await PurchaseOrder.create({
      productId,
      warehouseId,
      supplierId,
      quantityOrdered,
      orderDate: orderDate || new Date(),
      status: 'PENDING'
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error('createPurchaseOrder error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listOrders(req, res) {
  try {
    const orders = await PurchaseOrder.findAll({
      order: [['orderDate', 'DESC']]
    });
    return res.json(orders);
  } catch (error) {
    console.error('listOrders error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPurchaseOrderById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid purchase order id' });
    }

    const order = await PurchaseOrder.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Purchase order not found' });

    return res.json(order);
  } catch (error) {
    console.error('getPurchaseOrderById error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function markOrderAsArrived(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid purchase order id' });
    }

    const result = await sequelize.transaction(async (tx) => {
      const po = await PurchaseOrder.findByPk(id, { transaction: tx });
      if (!po) return null;
      if (po.status === 'COMPLETED') {
        return { alreadyCompleted: true, po };
      }

      const qty = Number(po.quantityOrdered || 0);

      if (qty > 0) {
        const wp = await WarehouseProduct.findOne({
          where: { productId: po.productId, warehouseId: po.warehouseId },
          transaction: tx
        });

        if (wp) {
          wp.quantity += qty;
          await wp.save({ transaction: tx });
        } else {
          await WarehouseProduct.create({
            productId: po.productId,
            warehouseId: po.warehouseId,
            quantity: qty
          }, { transaction: tx });
        }
      }

      po.status = 'COMPLETED';
      await po.save({ transaction: tx });
      return { po };
    });

    if (result === null) return res.status(404).json({ error: 'Purchase order not found' });
    if (result.alreadyCompleted) return res.status(400).json({ error: 'Purchase order already completed', order: result.po });

    return res.json(result.po);
  } catch (error) {
    console.error('markOrderAsArrived error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
