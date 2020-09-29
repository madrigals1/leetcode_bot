const mongoose = require('mongoose');
const {
  DB_NAME, DB_PORT, MONGO_URL, DB_USER, DB_PASSWORD,
} = require('../utils/constants');
const { SERVER_MESSAGES } = require('../utils/dictionary');
const { log, error } = require('../utils/helper');

// Schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

// Main class for Database
class Database {
  constructor() {
    const credentials = DB_USER && DB_PASSWORD ? `${DB_USER}:${DB_PASSWORD}@` : '';
    const authSource = DB_USER && DB_PASSWORD ? '?authSource=admin' : '';
    const databaseUrl = `${MONGO_URL}:${DB_PORT}/${DB_NAME}`;

    this.mongoUrl = `mongodb://${credentials}${databaseUrl}${authSource}`;

    // Indicator
    this.isRefreshing = false;
    this.lastRefreshStartedAt = null;
    this.lastRefreshFinishedAt = null;

    // Models
    this.UserModel = mongoose.model('User', userSchema);
  }

  // Connect to Database
  async connect() {
    await mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        log(SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
      })
      .catch((err) => {
        error(SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
      });
  }

  // Find all Users
  async findAllUsers() {
    return this.UserModel.find();
  }

  // Load User by `username`
  async loadUser(username) {
    return this.UserModel.findOne({ username });
  }

  // Add User to Database
  async addUser(username) {
    const existingUser = await this.loadUser(username);

    // If User does exist, no need to add new
    if (existingUser) return null;

    // Create new User and save
    const newUser = new this.UserModel({ username });
    await newUser.save();

    return newUser;
  }

  async removeUser(username) {
    const user = await this.loadUser(username);

    // If User does exist, no delete him, otherwise
    if (!user) return false;

    // If User exists, delete him
    await this.UserModel.deleteOne({ username });

    return true;
  }
}

module.exports = new Database();
