import express from 'express';
import cors from 'cors';
import suppliersRouter from './routes/suppliers.routes.js';
import warehousesRouter from './routes/warehouses.routes.js';
import productsRouter from './routes/products.routes.js';
import purchaseOrdersRouter from './routes/purchaseOrders.routes.js';
import reorderRoutes from './routes/reorder.routes.js';
import { sequelize } from './models/index.js';

const app = express();

// Allow origin from env, fallback to localhost for local dev
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/warehouses', warehousesRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/purchase-orders', purchaseOrdersRouter);
app.use('/api/v1/reorder', reorderRoutes);

// Health check
app.get('/api/v1/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check failed:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default app;
