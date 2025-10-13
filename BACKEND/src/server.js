import app from './app.js';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;


async function start() {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established.');

    const server = app.listen(PORT, () => {
      console.log(` Server listening on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log('\nShutting down server...');
      server.close(async () => {
        try {
          await sequelize.close();
          console.log('DB connection closed. Goodbye.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing DB connection', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1); 
  }
}

start();
