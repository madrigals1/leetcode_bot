const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const { log } = require('../../utils/helper');
const { SERVER_MESSAGES } = require('../../utils/dictionary');

const QUERIES = require('./queries');

class SQLite {
  // Connect to Database
  async connect() {
    return new Promise((resolve, reject) => {
      // Create database connection
      open({
        filename: 'src/database/sqlite3/leetbot.db',
        driver: sqlite3.Database,
      })
        .then((database) => {
          // Log that database is connected
          log(SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);

          // Set database object
          this.database = database;

          // Create database table
          this.createUserTable();

          resolve(true);
        })
        .catch((err) => {
          // Log that database connection had errors
          log(SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));

          reject(Error(err));
        });
    });
  }

  // Create Users table if not exists
  createUserTable() {
    return this.database.run(QUERIES.CREATE_USERS_TABLE);
  }

  // Find all Users
  async findAllUsers() {
    return this.database.all(QUERIES.FIND_ALL_USERS);
  }

  // Load User by `username`
  async loadUser(username) {
    return this.database.get(QUERIES.LOAD_USER, username);
  }

  // Add User to Database
  async addUser(username) {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.database.run(QUERIES.ADD_USER, username);
  }

  // Remove User from Database
  async removeUser(username) {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.database.run(QUERIES.REMOVE_USER, username);
  }

  // Remove all Users from Database
  async removeAllUsers() {
    return this.database.run(QUERIES.REMOVE_ALL_USERS);
  }
}

module.exports = SQLite;
