import express from 'express';
import { createSupplier, listSuppliers, getSupplierById } from '../controllers/suppliers.controller.js';

const router = express.Router();

router.post('/', createSupplier);      
router.get('/', listSuppliers);         
router.get('/:id', getSupplierById);    

export default router;
