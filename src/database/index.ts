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

function getDatabaseProvider(
  providerName: string,
): typeof MongoDB | typeof Postgres | typeof SQLite {
  return databaseMap[providerName] || SQLite;
}

// Get current database
const Database = getDatabaseProvider(constants.DB_PROVIDER);

export default new Database();
