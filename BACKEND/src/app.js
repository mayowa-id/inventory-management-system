import express from 'express';
import cors from 'cors';
import suppliersRouter from './routes/suppliers.routes.js';
import warehousesRouter from './routes/warehouses.routes.js';
import productsRouter from './routes/products.routes.js';
import purchaseOrdersRouter from './routes/purchaseOrders.routes.js';
import reorderRoutes from './routes/reorder.routes.js';
import { sequelize } from './models/index.js';

const app = express();

const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.length === 0) {
        return callback(new Error('CORS: No allowed origins configured'), false);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS: Origin not allowed'), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/warehouses', warehousesRouter);
app.use('/api/v1/products', (req, res, next) => {
  try {
    return productsRouter(req, res, next);
  } catch (err) {
    console.error('Products router sync error:', err);
    return next(err);
  }
});
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

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);

  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

export default app;
