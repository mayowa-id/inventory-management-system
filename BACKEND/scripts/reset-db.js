import { sequelize } from '../src/models/index.js';
(async () => {
await sequelize.drop();
console.log('Dropped all tables');
process.exit(0);
})();