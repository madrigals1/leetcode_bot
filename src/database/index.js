const { DB_PROVIDER } = require('../utils/constants');

const MongoDB = require('./mongo');
const Postgres = require('./postgres');

// Get map of database
const databaseMap = {
  mongo: MongoDB,
  postgres: Postgres,
};

// Get current database
const Database = databaseMap[DB_PROVIDER];

module.exports = new Database();
