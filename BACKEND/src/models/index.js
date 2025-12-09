import { DataTypes } from 'sequelize';
import  importedSequelize  from '../config/db.js';
import SupplierModel from './supplier.js';
import WarehouseModel from './warehouse.js';
import ProductModel from './product.js';
import WarehouseProductModel from './warehouseProduct.js';
import PurchaseOrderModel from './purchaseOrder.js';

const sequelize = globalThis.__sequelize || importedSequelize;
if (!globalThis.__sequelize) {
  globalThis.__sequelize = sequelize;
}

// initialize models
const Supplier = SupplierModel(sequelize, DataTypes);
const Warehouse = WarehouseModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const WarehouseProduct = WarehouseProductModel(sequelize, DataTypes);
const PurchaseOrder = PurchaseOrderModel(sequelize, DataTypes);

// associations
Product.belongsTo(Supplier, { as: 'defaultSupplier', foreignKey: 'defaultSupplierId' });
Supplier.hasMany(Product, { foreignKey: 'defaultSupplierId' });

Warehouse.belongsToMany(Product, { through: WarehouseProduct, foreignKey: 'warehouseId', otherKey: 'productId' });
Product.belongsToMany(Warehouse, { through: WarehouseProduct, foreignKey: 'productId', otherKey: 'warehouseId' });

Warehouse.hasMany(WarehouseProduct, { foreignKey: 'warehouseId' });
WarehouseProduct.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Product.hasMany(WarehouseProduct, { foreignKey: 'productId' });
WarehouseProduct.belongsTo(Product, { foreignKey: 'productId' });

PurchaseOrder.belongsTo(Product, { foreignKey: 'productId' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });
PurchaseOrder.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

// export models and sequelize

export default{
  sequelize,
  Supplier,
  Warehouse,
  Product,
  WarehouseProduct,
  PurchaseOrder
};

export {
  sequelize,
  Supplier,
  Warehouse,
  Product,
  WarehouseProduct,
  PurchaseOrder
};
