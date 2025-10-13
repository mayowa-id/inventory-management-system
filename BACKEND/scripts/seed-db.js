import { sequelize, Supplier, Warehouse, Product, WarehouseProduct } from '../src/models/index.js';


(async () => {
await sequelize.sync({ force: true });


const s1 = await Supplier.create({ name: 'Acme Supplies', contactInfo: { email: 'acme@example.com' } });
const w1 = await Warehouse.create({ name: 'Central', location: 'Lagos', capacity: 1000 });


const p1 = await Product.create({ sku: 'SKU-001', name: 'Widget A', description: 'A widget', reorderThreshold: 50, defaultSupplierId: s1.id });
const p2 = await Product.create({ sku: 'SKU-002', name: 'Widget B', description: 'Another widget', reorderThreshold: 30, defaultSupplierId: s1.id });


await WarehouseProduct.create({ warehouseId: w1.id, productId: p1.id, quantity: 40 });
await WarehouseProduct.create({ warehouseId: w1.id, productId: p2.id, quantity: 10 });


console.log('Seed complete');
process.exit(0);
})();