// scripts/publishTest.js
const { publishTask } = require('../src/messaging/producer');

(async () => {
  // пример payload: вычислить факториал 7
  await publishTask({ op: 'factorial', n: 7 });
})().catch(console.error);
