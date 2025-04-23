// scripts/testDb.js
const { query } = require('../src/db');

(async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('DB time is:', res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
})();
