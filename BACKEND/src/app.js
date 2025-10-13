import express from 'express';
import cors from 'cors';
import suppliersRouter from './routes/suppliers.routes.js';
import warehousesRouter from './routes/warehouses.routes.js';
import productsRouter from './routes/products.routes.js';
import purchaseOrdersRouter from './routes/purchaseOrders.routes.js';
import reorderRoutes from './routes/reorder.routes.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);

app.use(express.json());

app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/warehouses', warehousesRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/purchase-orders', purchaseOrdersRouter);
app.use('/api/v1/reorder', reorderRoutes);

app.get('/api/v1/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check failed:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(' Database synchronized successfully');
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(' Database sync failed:', err);
  });

export default app;
