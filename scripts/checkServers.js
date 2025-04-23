// scripts/checkServers.js
const { query } = require('../src/db');

(async () => {
  try {
    const res = await query(`
      SELECT
        server_id,
        status,
        NOW() - last_seen AS age,
        CASE
          WHEN last_seen < NOW() - INTERVAL '15 seconds' THEN 'offline'
          ELSE 'online'
        END AS calc_status
      FROM servers
    `);
    console.table(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
