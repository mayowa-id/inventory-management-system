import express from 'express';
import { listProducts, getProduct, createProduct, adjustStock} from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.post('/:id/adjust-stock', adjustStock);

export default router;
