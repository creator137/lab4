// scripts/publishClients.js
const { spawn } = require('child_process');
const path = require('path');

for (let i = 1; i <= 5; i++) {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'publish'], {
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit'],
    cwd: path.resolve(__dirname, '..'),
  });
  child.on('error', (err) => console.error(`Failed to start publisher #${i}:`, err));
  console.log(`Spawned publisher #${i}`);
}
