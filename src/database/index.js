const { DB_PROVIDER } = require('../utils/constants');

const MongoDB = require('./mongo');
const Postgres = require('./postgres');
const SQLite = require('./sqlite3');

// Get map of database
const databaseMap = {
  mongo: MongoDB,
  postgres: Postgres,
  sqlite3: SQLite,
  sqlite: SQLite,
};

// Get current database
const Database = databaseMap[DB_PROVIDER];

module.exports = new Database();
