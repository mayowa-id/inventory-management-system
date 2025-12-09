import { sequelize } from './src/config/db.js';
import models from './src/models/index.js';

const { Product, Supplier, Warehouse, WarehouseProduct, PurchaseOrder } = models;

// Sample data generators
const suppliers = [
  { name: 'Tech Supplies Co.', contactInfo: { email: 'contact@techsupplies.com', phone: '+1-555-0101' } },
  { name: 'Global Electronics Ltd.', contactInfo: { email: 'sales@globalelectronics.com', phone: '+1-555-0102' } },
  { name: 'Prime Components Inc.', contactInfo: { email: 'info@primecomponents.com', phone: '+1-555-0103' } },
  { name: 'Mega Hardware Solutions', contactInfo: { email: 'orders@megahardware.com', phone: '+1-555-0104' } },
  { name: 'Direct Source Imports', contactInfo: { email: 'support@directsource.com', phone: '+1-555-0105' } }
];

const warehouses = [
  { name: 'Main Distribution Center', location: 'New York, NY', capacity: 10000 },
  { name: 'West Coast Warehouse', location: 'Los Angeles, CA', capacity: 8000 },
  { name: 'Central Hub', location: 'Chicago, IL', capacity: 6000 },
  { name: 'East Coast Facility', location: 'Miami, FL', capacity: 5000 }
];

const productCategories = [
  { category: 'Electronics', items: ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Webcam', 'Headphones', 'USB Cable', 'HDMI Cable'] },
  { category: 'Office', items: ['Desk Chair', 'Standing Desk', 'File Cabinet', 'Whiteboard', 'Printer', 'Paper Ream', 'Stapler', 'Pen Set'] },
  { category: 'Tech Accessories', items: ['Phone Case', 'Screen Protector', 'Power Bank', 'Charging Cable', 'Laptop Bag', 'Docking Station'] },
  { category: 'Networking', items: ['Router', 'Switch', 'Ethernet Cable', 'WiFi Extender', 'Modem', 'Network Card'] }
];

function generateSKU(category, index) {
  const prefix = category.substring(0, 3).toUpperCase();
  return `${prefix}-${String(index).padStart(4, '0')}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysBack, daysForward) {
  const today = new Date();
  const randomDays = getRandomInt(-daysBack, daysForward);
  const date = new Date(today);
  date.setDate(date.getDate() + randomDays);
  return date;
}

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seed...');

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ force: true }); // WARNING: This drops existing tables!
    console.log(' Database synced');

    // Create Suppliers
    console.log('Creating suppliers...');
    const createdSuppliers = await Supplier.bulkCreate(suppliers);
    console.log(`Created ${createdSuppliers.length} suppliers`);

    // Create Warehouses
    console.log('Creating warehouses...');
    const createdWarehouses = await Warehouse.bulkCreate(warehouses);
    console.log(`Created ${createdWarehouses.length} warehouses`);

    // Create Products
    console.log(' Creating products...');
    const products = [];
    let skuIndex = 1;

    for (const { category, items } of productCategories) {
      for (const item of items) {
        products.push({
          sku: generateSKU(category, skuIndex++),
          name: `${item} - ${category}`,
          description: `High-quality ${item.toLowerCase()} for professional use. Reliable and durable.`,
          reorderThreshold: getRandomInt(10, 50),
          defaultSupplierId: createdSuppliers[getRandomInt(0, createdSuppliers.length - 1)].id
        });
      }
    }

    const createdProducts = await Product.bulkCreate(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create Warehouse-Product relationships (inventory)
    console.log(' Distributing inventory across warehouses...');
    const warehouseProducts = [];

    for (const product of createdProducts) {
      // Each product will be in 2-4 warehouses
      const numWarehouses = getRandomInt(2, 4);
      const selectedWarehouses = [];
      
      while (selectedWarehouses.length < numWarehouses) {
        const warehouse = createdWarehouses[getRandomInt(0, createdWarehouses.length - 1)];
        if (!selectedWarehouses.includes(warehouse.id)) {
          selectedWarehouses.push(warehouse.id);
          warehouseProducts.push({
            warehouseId: warehouse.id,
            productId: product.id,
            quantity: getRandomInt(0, 200) // Some items might be out of stock (0)
          });
        }
      }
    }

    await WarehouseProduct.bulkCreate(warehouseProducts);
    console.log(` Created ${warehouseProducts.length} warehouse-product entries`);

    // Create Purchase Orders
    console.log(' Creating purchase orders...');
    const purchaseOrders = [];
    const statuses = ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    for (let i = 0; i < 50; i++) {
      const product = createdProducts[getRandomInt(0, createdProducts.length - 1)];
      const warehouse = createdWarehouses[getRandomInt(0, createdWarehouses.length - 1)];
      const supplier = createdSuppliers[getRandomInt(0, createdSuppliers.length - 1)];
      const orderDate = getRandomDate(30, 0); // Last 30 days
      
      purchaseOrders.push({
        productId: product.id,
        supplierId: supplier.id,
        warehouseId: warehouse.id,
        quantityOrdered: getRandomInt(50, 500),
        orderDate: orderDate,
        expectedArrivalDate: new Date(orderDate.getTime() + getRandomInt(3, 14) * 24 * 60 * 60 * 1000),
        status: statuses[getRandomInt(0, statuses.length - 1)]
      });
    }

    await PurchaseOrder.bulkCreate(purchaseOrders);
    console.log(` Created ${purchaseOrders.length} purchase orders`);

    // Summary
    console.log('\n Database seeding completed successfully!');
    console.log('\n Summary:');
    console.log(`   - Suppliers: ${createdSuppliers.length}`);
    console.log(`   - Warehouses: ${createdWarehouses.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Inventory Records: ${warehouseProducts.length}`);
    console.log(`   - Purchase Orders: ${purchaseOrders.length}`);

    // Show some samplSample Products:');
    const sampleProducts = await Product.findAll({ limit: 5 });
    sampleProducts.forEach(p => {
      console.log(`   - ${p.sku}: ${p.name} (Reorder at: ${p.reorderThreshold})`);
    });

    console.log('\n Sample Inventory:');
    const sampleInventory = await WarehouseProduct.findAll({ 
      limit: 5,
      include: [
        { model: Product, as: 'product' },
        { model: Warehouse, as: 'warehouse' }
      ]
    });
    sampleInventory.forEach(inv => {
      console.log(`   - ${inv.warehouse?.name}: ${inv.product?.name} (Qty: ${inv.quantity})`);
    });

  } catch (error) {
    console.error(' Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n Database connection closed');
  }
}

// Run the seed
seedDatabase();