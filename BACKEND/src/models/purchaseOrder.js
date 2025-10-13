export default (sequelize, DataTypes) => {
const PurchaseOrder = sequelize.define('PurchaseOrder', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
productId: { type: DataTypes.INTEGER },
supplierId: { type: DataTypes.INTEGER },
warehouseId: { type: DataTypes.INTEGER },
quantityOrdered: { type: DataTypes.INTEGER, allowNull: false },
orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
expectedArrivalDate: { type: DataTypes.DATE },
status: { type: DataTypes.STRING, defaultValue: 'PENDING' }
}, { tableName: 'purchase_orders', timestamps: false });
return PurchaseOrder;
};