// scripts/publishLoop.js

// 1) Глобальный хендлер необработанных Promise-ошибок,
//    чтобы loop не падал при закрытии брокера
process.on('unhandledRejection', (err) => {
  console.error('❗ Unhandled Rejection in publishLoop:', err.message);
  // не выходим — будем пытаться снова
});

const { publishTask } = require('../src/messaging/producer');
const WAIT_MS = 1000; // интервал между отправками

let counter = 1;

async function loop() {
  while (true) {
    try {
      const task = { op: 'factorial', n: 7 };
      const id = await publishTask(task);
      console.log(`▶️ Published task #${counter++} (id=${id})`);
    } catch (err) {
      console.error('❌ Ошибка при публикации:', err.message);
      // при ошибке (например, брокер недоступен) подождём чуть дольше
      await new Promise((r) => setTimeout(r, WAIT_MS * 5));
      continue;
    }
    await new Promise((r) => setTimeout(r, WAIT_MS));
  }
}

loop();
