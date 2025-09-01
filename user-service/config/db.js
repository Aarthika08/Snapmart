// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const DB_PASSWORD = (process.env.DB_PASSWORD || '').toString().trim(); // ✅ force string

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//  process.env.DB_PASSWORD?.toString(), // <-- must be a string

//   {
   
//       host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     logging: false, 
//   }
// );
// sequelize.authenticate()
//   .then(() => console.log('✅ Database connected'))
//   .catch(err => console.error('❌ DB connection error:', err));

// module.exports = sequelize;


require('dotenv').config();
const { Sequelize } = require('sequelize');

// Force all DB env values to strings and trim spaces
const DB_NAME = (process.env.DB_NAME || '').trim();
const DB_USER = (process.env.DB_USER || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_HOST = (process.env.DB_HOST || '').trim();
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false, // Set true if you want to see SQL logs
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
  }
})();

module.exports = sequelize;
