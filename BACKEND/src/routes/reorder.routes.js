import express from 'express';
import { triggerReorderScan } from '../controllers/reorder.controller.js';

const router = express.Router();

router.post('/run', triggerReorderScan);

export default router;