// src/messaging/producer.js

const amqp = require('amqplib');
const { createTask } = require('../services/taskService');
const { discover } = require('../discovery/client');

async function publishTask(payload) {
  // 1) Запись в БД
  const taskId = await createTask(payload);

  // 2) Динамический дискавери конфигурации RabbitMQ
  const { rabbit } = await discover(3000);
  const RABBIT_URL = `amqp://${rabbit.host}:${rabbit.port}`;

  // 3) Подключаемся и шлём в очередь
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();
  const QUEUE = 'tasks';
  await ch.assertQueue(QUEUE, { durable: true });
  const msg = JSON.stringify({ taskId, payload });
  ch.sendToQueue(QUEUE, Buffer.from(msg), { persistent: true });
  console.log(`Published task ${taskId}`);

  // 4) Закрываем соединение — безопасно в try/catch, чтобы не упасть при shutdown
  setTimeout(() => {
    try {
      conn.close();
    } catch (err) {
      console.warn('⚠️ Error closing AMQP connection:', err.message);
    }
  }, 500);

  return taskId;
}

module.exports = { publishTask };

// Обёртка для прямого запуска скрипта
if (require.main === module) {
  (async () => {
    const n = 1 + Math.floor(Math.random() * 12); // 1‒12
    const op = Math.random() < 0.5 ? 'factorial' : 'isPrime';
    await publishTask({ op, n });
    console.log(`Published single task: ${op}(${n})`);
    process.exit(0);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
