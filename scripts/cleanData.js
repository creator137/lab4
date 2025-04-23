// scripts/cleanData.js
const { query } = require('../src/db');

(async () => {
  try {
    // Очищаем таблицы и сбрасываем ID‑счётчики
    await query(`
      TRUNCATE TABLE
        tasks,
        servers
      RESTART IDENTITY CASCADE;
    `);
    console.log('✅ All data in tasks and servers tables has been cleared.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to clear data:', err);
    process.exit(1);
  }
})();
