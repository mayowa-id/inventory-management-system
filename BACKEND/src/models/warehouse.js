export default (sequelize, DataTypes) => {
const Warehouse = sequelize.define('Warehouse', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
location: { type: DataTypes.STRING },
capacity: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'warehouses', timestamps: false });
return Warehouse;
};