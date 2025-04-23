// src/messaging/consumer.js

// heartbeat
const { sendHeartbeat } = require('../services/serverHeartbeat');
sendHeartbeat().catch(console.error);
setInterval(() => sendHeartbeat().catch(console.error), 5000);

const amqp = require('amqplib');
const { markProcessing, markDone } = require('../services/taskService');
const { discover } = require('../discovery/client');

const SERVER_ID = process.env.SERVER_ID || `srv-${Math.random().toString(36).slice(2, 7)}`;

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
  return true;
}
function doCompute({ op, n }) {
  switch (op) {
    case 'factorial':
      return factorial(n);
    case 'isPrime':
      return isPrime(n);
    default:
      return null;
  }
}

async function startConsumer() {
  // 1) дискаверим RabbitMQ
  const { rabbit } = await discover(3000);
  const RABBIT_URL = `amqp://${rabbit.host}:${rabbit.port}`;

  // 2) подключаемся
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();
  const QUEUE = 'tasks';
  await ch.assertQueue(QUEUE, { durable: true });
  ch.prefetch(1);
  console.log(`[*] Waiting for tasks. Server ID=${SERVER_ID}`);

  // 3) начинаем consume
  ch.consume(
    QUEUE,
    async (msg) => {
      const { taskId, payload } = JSON.parse(msg.content.toString());
      console.log(`[x] Received task ${taskId}`, payload);

      await markProcessing(taskId, SERVER_ID);
      const resultValue = doCompute(payload);
      await markDone(taskId, { result: resultValue });
      ch.ack(msg);

      console.log(`[✓] Done task ${taskId}`, resultValue);
    },
    { noAck: false },
  );
}

startConsumer().catch((err) => {
  console.error(err);
  process.exit(1);
});
