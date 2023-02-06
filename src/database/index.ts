import { constants } from '../utils/constants';

import DatabaseProvider from './database.proto';
import SQLite from './sqlite3';

// Get map of database
const databaseMap = {
  sqlite3: SQLite,
  sqlite: SQLite,
};

// Get specific Database
const Database: typeof DatabaseProvider = (
  databaseMap[constants.DATABASE.PROVIDER] || SQLite
);

export default new Database();
