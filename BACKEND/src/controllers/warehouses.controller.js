import { Warehouse, WarehouseProduct } from '../models/index.js';

export async function createWarehouse(req, res) {
  try {
    const { name, location, capacity } = req.body;
    if (!name || typeof capacity !== 'number') {
      return res.status(400).json({ error: 'name and numeric capacity are required' });
    }

    const warehouse = await Warehouse.create({ name, location: location || null, capacity });
    res.status(201).json(warehouse);
  } catch (err) {
    console.error('createWarehouse error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listWarehouses(req, res) {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (err) {
    console.error('listWarehouses error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWarehouseById(req, res) {
  try {
    const id = Number(req.params.id);
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });

    // include current occupancy (sum of quantities)
    const occupancy = await WarehouseProduct.sum('quantity', { where: { warehouseId: id } }) || 0;

    res.json({ ...warehouse.toJSON(), currentOccupancy: occupancy });
  } catch (err) {
    console.error('getWarehouseById error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
