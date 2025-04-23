// src/services/taskService.js
const { query } = require('../db');

async function createTask(payload) {
  const res = await query(
    `INSERT INTO tasks (payload)
     VALUES ($1)
     RETURNING id`,
    [payload],
  );
  return res.rows[0].id;
}

async function markProcessing(taskId, serverId) {
  await query(
    `UPDATE tasks
       SET status = 'processing',
           assigned_to = $1,
           updated_at = NOW()
     WHERE id = $2`,
    [serverId, taskId],
  );
}

async function markDone(taskId, resultJson) {
  await query(
    `UPDATE tasks
       SET status = 'done',
           result = $1,
           updated_at = NOW()
     WHERE id = $2`,
    [resultJson, taskId],
  );
}

module.exports = { createTask, markProcessing, markDone };
