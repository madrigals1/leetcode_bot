import constants from '../utils/constants';

import MongoDB from './mongo';
import Postgres from './postgres';
import SQLite from './sqlite3';

// Get map of database
const databaseMap = {
  mongo: MongoDB,
  postgres: Postgres,
  sqlite3: SQLite,
  sqlite: SQLite,
};

// Get current database
const Database = databaseMap[constants.DB_PROVIDER];

export default new Database();
