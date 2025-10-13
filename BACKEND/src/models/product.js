export default (sequelize, DataTypes) => {
const Product = sequelize.define('Product', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
sku: { type: DataTypes.STRING, unique: true, allowNull: false },
name: { type: DataTypes.STRING, allowNull: false },
description: { type: DataTypes.TEXT },
reorderThreshold: { type: DataTypes.INTEGER, defaultValue: 0 },
defaultSupplierId: { type: DataTypes.INTEGER }
}, { tableName: 'products', timestamps: false });
return Product;
};