import { WarehouseProduct, Product, PurchaseOrder, Warehouse, sequelize } from '../models/index.js';
import { addDays } from '../utils/date.js';


export async function runReorderScan({ leadTimeDays = Number(process.env.LEAD_TIME_DAYS || 3), specific = null } = {}) {
const where = specific ? { productId: specific.productId, warehouseId: specific.warehouseId } : {};
const rows = await WarehouseProduct.findAll({ where, include: [Product, Warehouse] });


for (const row of rows) {
const product = await Product.findByPk(row.productId);
if (!product) continue;
if (row.quantity >= product.reorderThreshold) continue;


const needed = product.reorderThreshold - row.quantity;


const warehouseQtySum = await WarehouseProduct.sum('quantity', { where: { warehouseId: row.warehouseId } }) || 0;
const warehouse = await Warehouse.findByPk(row.warehouseId);
const available = Math.max(0, warehouse.capacity - warehouseQtySum);


if (available <= 0) {
console.warn(`Warehouse ${warehouse.id} full — cannot reorder product ${product.id}`);
continue;
}


const orderQty = Math.min(needed, available);


await PurchaseOrder.create({
productId: product.id,
supplierId: product.defaultSupplierId || null,
warehouseId: warehouse.id,
quantityOrdered: orderQty,
expectedArrivalDate: addDays(new Date(), leadTimeDays),
status: 'PENDING'
});
}
}