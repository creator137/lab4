// src/discovery/dispatcher.js
const dgram = require('dgram');
const { db, rabbit } = require('../config'); // текущий config.json

const PORT = 41234;
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  const text = msg.toString().trim();
  if (text === 'DISCOVER') {
    const payload = JSON.stringify({ db, rabbit });
    server.send(payload, rinfo.port, rinfo.address, (err) => {
      if (err) console.error('Send error:', err);
      else console.log(`Replied to ${rinfo.address}:${rinfo.port}`);
    });
  }
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`Dispatcher listening ${addr.address}:${addr.port}`);
});

server.bind(PORT);
