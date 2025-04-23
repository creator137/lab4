// scripts/stopServers.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STORE = path.resolve(__dirname, '..', 'server-pids.json');
if (!fs.existsSync(STORE)) {
  console.error(`❌ File not found: ${STORE}`);
  process.exit(1);
}

// Сколько убить — передайте первым аргументом, по умолчанию 1
const toKillCount = parseInt(process.argv[2], 10) || 1;

let servers = JSON.parse(fs.readFileSync(STORE, 'utf8'));
const killed = [];

for (let i = 0; i < toKillCount && servers.length > 0; i++) {
  const { id, pid } = servers.shift();
  try {
    if (process.platform === 'win32') {
      // Windows: форсированно убиваем процесс по PID
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      // *nix: убиваем процесс
      process.kill(pid);
    }
    console.log(`✅ Stopped ${id} (PID ${pid})`);
    killed.push(id);
  } catch (err) {
    console.warn(`⚠️  Failed to stop ${id} (PID ${pid}): ${err.message}`);
  }
}

// Перезаписываем оставшийся список
fs.writeFileSync(STORE, JSON.stringify(servers, null, 2));

if (killed.length === 0) {
  console.log('ℹ️  No servers were stopped (maybe PIDs were stale).');
} else {
  console.log(`🔢 Servers remaining in store: ${servers.length}`);
}
