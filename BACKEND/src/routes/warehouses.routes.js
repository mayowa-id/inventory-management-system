import express from 'express';
import { createWarehouse, listWarehouses, getWarehouseById } from '../controllers/warehouses.controller.js';

const router = express.Router();

router.post('/', createWarehouse);     
router.get('/', listWarehouses);        
router.get('/:id', getWarehouseById);   
export default router;
