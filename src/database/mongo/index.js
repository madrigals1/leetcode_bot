const mongoose = require('mongoose');

const { MONGO } = require('../../utils/constants');
const { SERVER_MESSAGES } = require('../../utils/dictionary');
const { log, error } = require('../../utils/helper');

const { UserModel } = require('./schemas');

// Main class for MongoDB Database
class MongoDB {
  constructor() {
    // If authentication credentials were provided in environment, use them.
    // If not, use empty string in MongoDB connection
    const credentials = MONGO.DB_AUTHENTICATION_ENABLED
      ? `${MONGO.DB_USER}:${MONGO.DB_PASSWORD}@` : '';

    // Set Authentication Source to connect to MongoDB database
    const authSource = MONGO.DB_AUTHENTICATION_ENABLED
      ? '?authSource=admin' : '';
    // URL for Connection to MongoDB, is already usable for connection.
    const databaseUrl = `${MONGO.DB_URL}:${MONGO.DB_PORT}/${MONGO.DB_NAME}`;

    // URL for Connection to MongoDB, that contains authentication
    this.mongoUrl = `mongodb://${credentials}${databaseUrl}${authSource}`;

    // Indicator to see, if Database is already refreshing
    this.isRefreshing = false;

    // Database Models
    this.UserModel = UserModel;
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

  async removeAllUsers() {
    // Delete all users
    await this.UserModel.deleteMany({});

    return true;
  }
}

module.exports = MongoDB;
