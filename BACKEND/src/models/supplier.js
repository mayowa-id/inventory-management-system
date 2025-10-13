export default (sequelize, DataTypes) => {
const Supplier = sequelize.define('Supplier', {
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
contactInfo: { type: DataTypes.JSONB }
}, { tableName: 'suppliers', timestamps: false });
return Supplier;
};