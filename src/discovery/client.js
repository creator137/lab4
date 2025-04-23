// src/discovery/client.js
const dgram = require('dgram');

function discover(timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');

    // Таймер на отказоустойчивость
    const timer = setTimeout(() => {
      socket.removeAllListeners('message');
      socket.close();
      reject(new Error('Discovery timeout'));
    }, timeoutMs);

    socket.on('error', (err) => {
      clearTimeout(timer);
      socket.close();
      reject(err);
    });

    socket.on('message', (msg) => {
      clearTimeout(timer);
      socket.close();
      try {
        const cfg = JSON.parse(msg.toString());
        resolve(cfg);
      } catch (e) {
        reject(e);
      }
    });

    socket.bind(() => {
      socket.setBroadcast(true);
      const msg = Buffer.from('DISCOVER');
      socket.send(msg, 0, msg.length, 41234, '255.255.255.255', (err) => {
        if (err) {
          clearTimeout(timer);
          socket.close();
          reject(err);
        }
      });
    });
  });
}

module.exports = { discover };
