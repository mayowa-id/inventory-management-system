import express from 'express';
import { listOrders, createPurchaseOrder, getPurchaseOrderById, markOrderAsArrived } from '../controllers/purchaseOrders.controller.js';

const router = express.Router();

router.get('/', listOrders);
router.post('/', createPurchaseOrder);
router.get('/:id', getPurchaseOrderById);
router.post('/:id/arrive', markOrderAsArrived);

export default router;
