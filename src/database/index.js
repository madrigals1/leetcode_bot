const { DB_PROVIDER } = require('../utils/constants');

const MongoDB = require('./mongo');

// Get map of database
const databaseMap = {
  mongo: MongoDB,
};

// Get current database
const Database = databaseMap[DB_PROVIDER];

module.exports = new Database();
