import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

// Initialize DB connection once per serverless cold start
let isDbConnected = false;

export default async function handler(req, res) {
  try {
    if (!isDbConnected) {
      await sequelize.authenticate();
      console.log('Database connected');
      isDbConnected = true;
    }
    app(req, res);
  } catch (err) {
    console.error('Serverless DB connection error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
}
