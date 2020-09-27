const monk = require('monk');
const {
  DB_NAME, DB_PORT, MONGO_URL, DB_USER, DB_PASSWORD,
} = require('../utils/constants');
const { SERVER_MESSAGES } = require('../utils/dictionary');
const { log, error } = require('../utils/helper');

// Main class for Database
class Database {
  constructor() {
    // Environment variables
    this.databaseUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${MONGO_URL}:${DB_PORT}/${DB_NAME}`;

    // Indicator
    this.isRefreshing = false;
    this.lastRefreshStartedAt = null;
    this.lastRefreshFinishedAt = null;
  }

  connect() {
    // Connect to MongoDB
    try {
      const connection = monk(this.databaseUrl);

      // Create Collection
      this.users = connection.get('User');
      this.users.createIndex('username last');

      log(SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
    } catch (err) {
      error(SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
    }
  }

  // Find all Users
  async findAllUsers() {
    return this.users.find();
  }

  // Load User by `username`
  async loadUser(username) {
    return this.users.findOne({ username });
  }

  // Add User to Database
  async addUser(username) {
    const existingUser = await this.loadUser(username);

    // If User does exist, no need to add new
    if (existingUser) return null;

    // Create new User and return
    return this.users.insert({ username });
  }

  async removeUser(username) {
    const user = await this.loadUser(username);

    // If User does exist, no delete him, otherwise
    if (!user) return false;

    // If User exists, delete him
    await this.users.remove({ username });

    return true;
  }
}

module.exports = new Database();
