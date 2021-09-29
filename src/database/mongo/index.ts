import * as mongoose from 'mongoose';

import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { log, error } from '../../utils/helper';
import DatabaseProvider from '../database.proto';

import UserModel from './schemas';

const { MONGO } = constants.DATABASE;

// Main class for MongoDB Database
class MongoDB extends DatabaseProvider {
  // If authentication credentials were provided in environment, use them.
  // If not, use empty string in MongoDB connection
  credentials: string = MONGO.AUTHENTICATION_ENABLED
    ? `${MONGO.USER}:${MONGO.PASSWORD}@`
    : '';

  // Set Authentication Source to connect to MongoDB database
  authSource: string = MONGO.AUTHENTICATION_ENABLED
    ? '?authSource=admin'
    : '';

  // URL for Connection to MongoDB, is already usable for connection.
  databaseUrl = `${MONGO.URL}:${MONGO.PORT}/${MONGO.NAME}`;

  // URL for Connection to MongoDB, that contains authentication
  mongoUrl = `mongodb://${this.credentials}${this.databaseUrl}${this.authSource}`;

  // Indicator to see, if Database is already refreshing
  isRefreshing = false;

  UserModel = UserModel;

  // Connect to Database
  async connect(): Promise<void> {
    await mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        log(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
      })
      .catch((err) => {
        error(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
      });
  }

  // Find all Users
  async findAllUsers() {
    return this.UserModel.find();
  }

  // Load User by `username`
  async loadUser(username: string) {
    return this.UserModel.findOne({ username });
  }

  // Add User to Database
  async addUser(username: string) {
    const existingUser = await this.loadUser(username);

    // If User does exist, no need to add new
    if (existingUser) return null;

    // Create new User and save
    const newUser = new this.UserModel({ username });
    await newUser.save();

    return newUser;
  }

  async removeUser(username: string): Promise<boolean> {
    const user = await this.loadUser(username);

    // If User does exist, no delete him, otherwise
    if (!user) return false;

    // If User exists, delete him
    await this.UserModel.deleteOne({ username });

    return true;
  }

  async removeAllUsers(): Promise<boolean> {
    // Delete all users
    await this.UserModel.deleteMany({});

    return true;
  }
}

export default MongoDB;
