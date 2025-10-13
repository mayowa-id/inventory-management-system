import { Supplier } from '../models/index.js';

export async function createSupplier(req, res) {
  try {
    const { name, contactInfo } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const supplier = await Supplier.create({ name, contactInfo: contactInfo || {} });
    res.status(201).json(supplier);
  } catch (err) {
    console.error('createSupplier error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listSuppliers(req, res) {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    console.error('listSuppliers error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSupplierById(req, res) {
  try {
    const id = Number(req.params.id);
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    console.error('getSupplierById error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
