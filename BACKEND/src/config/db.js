import pg from 'pg';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres:%23Twilightworld99@db.ranmwhlxwtdrwuwsrjgd.supabase.co:5432/postgres';

console.log('Connecting to database...');

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export { sequelize };
export default sequelize;