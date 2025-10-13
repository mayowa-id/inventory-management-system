export default (sequelize, DataTypes) => {
const WarehouseProduct = sequelize.define('WarehouseProduct', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
warehouseId: { type: DataTypes.INTEGER, allowNull: false },
productId: { type: DataTypes.INTEGER, allowNull: false },
quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'warehouse_products', timestamps: false });
return WarehouseProduct;
};