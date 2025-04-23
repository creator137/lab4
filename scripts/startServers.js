// scripts/startServers.js

/**
 * Скрипт запускает указанное количество серверов-consumer’ов,
 * выводя их логи в текущий терминал для отладки.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const STORE = path.resolve(__dirname, '..', 'server-pids.json');
// Число серверов из аргументов: `node scripts/startServers.js 3`
const count = parseInt(process.argv[2], 10) || 5;

const pids = [];

for (let i = 1; i <= count; i++) {
  const id = `srv-${i}`;
  const child = spawn('node', ['src/messaging/consumer.js'], {
    env: { ...process.env, SERVER_ID: id },
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit', // теперь логи consumer.js попадут в этот терминал
  });

  // Запоминаем PID
  pids.push({ id, pid: child.pid });
  console.log(`Started ${id} (PID ${child.pid})`);
}

// Сохраняем список запущенных серверов
fs.writeFileSync(STORE, JSON.stringify(pids, null, 2));
console.log(`Saved ${pids.length} server PIDs to ${STORE}`);
