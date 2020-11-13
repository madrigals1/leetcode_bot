const Database = require('better-sqlite3');

const { log } = require('../../utils/helper');
const { SERVER_MESSAGES } = require('../../utils/dictionary');

const QUERIES = require('./queries');

class SQLite {
  // Connect to Database
  connect() {
    // Send message back to channel
    return new Promise((resolve, reject) => {
      try {
        this.database = new Database('leetbot.db');

        // Create User table if not exists
        this.createUserTable();

        // SQL statements dictionary
        this.statements = {};

        // Prepare SQL statements
        Object.entries(QUERIES).forEach(([key, value]) => {
          this.statements[key] = this.database.prepare(value);
        });

        // Log that database is connected
        log(SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
        resolve(true);
      } catch (e) {
        log(SERVER_MESSAGES.CONNECTION_STATUS.ERROR(e));
        reject(Error(e));
      }
    });
  }

  // Create Users table if not exists
  createUserTable() {
    this.database.prepare(QUERIES.CREATE_USERS_TABLE).run();
  }

  // Find all Users
  async findAllUsers() {
    return this.statements.FIND_ALL_USERS.all();
  }

  // Load User by `username`
  async loadUser(username) {
    return this.statements.LOAD_USER.get(username);
  }

  // Add User to Database
  async addUser(username) {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.statements.ADD_USER.run(username);
  }

  // Remove User from Database
  async removeUser(username) {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.statements.REMOVE_USER.run(username);
  }

  // Remove all Users from Database
  async removeAllUsers() {
    return this.statements.REMOVE_ALL_USERS;
  }
}

module.exports = SQLite;
