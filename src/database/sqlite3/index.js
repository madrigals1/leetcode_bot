const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const { log } = require('../../utils/helper');
const { SERVER_MESSAGES } = require('../../utils/dictionary');

const QUERIES = require('./queries');

class SQLite {
  // Connect to Database
  async connect() {
    // Create database connection
    const connection = await open({
      filename: 'leetbot.db',
      driver: sqlite3.Database,
    })
      .then((database) => {
        // Log that database is connected
        log(SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
        return { success: true, database };
      })
      .catch((err) => {
        // Log that database connection had errors
        log(SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
        return { success: false, err };
      });

    // Set database from connection
    this.database = connection.success ? connection.database : null;

    // Create users table after connection
    await this.createUserTable();

    return new Promise((resolve, reject) => {
      if (connection.success) {
        resolve(true);
      }
      reject(Error(connection.err));
    });
  }

  // Create Users table if not exists
  createUserTable() {
    this.database.run(QUERIES.CREATE_USERS_TABLE);
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
