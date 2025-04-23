// src/db/index.js
const path = require('path');
const { Pool } = require('pg');

// забираем конфиг напрямую из config/config.json
const fullConfig = require(path.join(__dirname, '..', '..', 'config', 'config.json'));
const dbConfig = fullConfig.database;

const pool = new Pool(dbConfig);

module.exports = {
  /**
   * Выполняет SQL-запрос к базе Lab4
   * @param {string} text — текст запроса
   * @param {any[]} params — параметры для $1, $2 …
   * @returns {Promise<import('pg').QueryResult>}
   */
  query: (text, params) => pool.query(text, params),
};
