// scripts/checkTasks.js
const { query } = require('../src/db');

(async () => {
  try {
    const res = await query(`
      SELECT id, payload, status, result
        FROM tasks
       ORDER BY id;
    `);
    console.table(res.rows);
    process.exit(0);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    process.exit(1);
  }
})();
