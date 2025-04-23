// src/config.js
const path = require('path');
const cfg = require(path.join(__dirname, '..', 'config', 'config.json'));
module.exports = {
  db: cfg.database,
  rabbit: cfg.rabbit,
};
