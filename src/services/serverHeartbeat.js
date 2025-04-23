// src/services/serverHeartbeat.js
const { query } = require('../db');
const SERVER_ID = process.env.SERVER_ID || `srv-${Math.random().toString(36).slice(2, 7)}`;

async function sendHeartbeat() {
  await query(
    `INSERT INTO servers(server_id, last_seen, status)
     VALUES ($1, NOW(), 'online')
     ON CONFLICT (server_id)
       DO UPDATE SET last_seen = NOW(), status = 'online'`,
    [SERVER_ID],
  );
  console.log(`Heartbeat sent: ${SERVER_ID} at ${new Date().toISOString()}`);
}

module.exports = { sendHeartbeat };
