// server.js (local dev)
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { sequelize } from './models/index.js'; // ensure same path

<<<<<<< HEAD
const PORT = process.env.PORT || 3000;

=======
>>>>>>> 04940e4a93b189776253f3832cffc08f17b8e36f
async function start() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection established.');

<<<<<<< HEAD
    // Only for local dev:
    await sequelize.sync({ alter: true }); // optional: run only locally if desired
=======
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Start server
>>>>>>> 04940e4a93b189776253f3832cffc08f17b8e36f
    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

    // Graceful shutdown
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
