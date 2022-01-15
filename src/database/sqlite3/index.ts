import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { log } from '../../utils/helper';
import dictionary from '../../utils/dictionary';
import constants from '../../utils/constants';
import DatabaseProvider from '../database.proto';

import QUERIES from './queries';

const { SERVER_MESSAGES: SM } = dictionary;

class SQLite extends DatabaseProvider {
  database;

  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sqlite3filename = constants.DATABASE.SQLITE3.FILENAME;

      // Create database connection
      open({
        filename: `src/database/sqlite3/${sqlite3filename}`,
        driver: sqlite3.Database,
      })
        .then((database) => {
          // Log that database is connected
          log(SM.CONNECTION_STATUS.SUCCESSFUL);

          // Set database object
          this.database = database;

          // Create database table
          this.createUserTable();

          resolve(true);
        })
        .catch((err) => {
          // Log that database connection had errors
          log(SM.CONNECTION_STATUS.ERROR(err));

          reject(Error(err));
        });
    });
  }

  // Create Users table if not exists
  createUserTable(): unknown {
    return this.database.run(QUERIES.CREATE_USERS_TABLE);
  }

  // Find all Users
  async findAllUsers(): Promise<unknown> {
    return this.database.all(QUERIES.FIND_ALL_USERS);
  }

  // Load User by `username`
  async loadUser(username: string): Promise<unknown> {
    return this.database.get(QUERIES.LOAD_USER, username);
  }

  // Add User to Database
  async addUser(username: string): Promise<unknown> {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.database.run(QUERIES.ADD_USER, username);
  }

  // Remove User from Database
  async removeUser(username: string): Promise<unknown> {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.database.run(QUERIES.REMOVE_USER, username);
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<unknown> {
    return this.database.run(QUERIES.REMOVE_ALL_USERS);
  }
}

export default SQLite;
