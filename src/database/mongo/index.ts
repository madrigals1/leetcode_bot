import * as mongoose from 'mongoose';

import { constants } from '../../utils/constants';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { log, error } from '../../utils/helper';
import DatabaseProvider from '../database.proto';

import { UserModel, IUserModel } from './schemas';

const { MONGO } = constants.DATABASE;

// Main class for MongoDB Database
class MongoDB extends DatabaseProvider {
  providerName = 'MongoDB';

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

  UserModel: typeof UserModel = UserModel;

  // Connect to Database
  async connect(): Promise<void> {
    log(SM.IS_CONNECTING(this.providerName));

    await mongoose
      .connect(this.mongoUrl)
      .then(() => {
        log(SM.CONNECTION_STATUS.SUCCESSFUL);
      })
      .catch((err) => {
        error(SM.CONNECTION_STATUS.ERROR(err));
      });
  }

  // Find all Users
  async findAllUsers(): Promise<IUserModel[]> {
    return this.UserModel.find();
  }

  // Load User by `username`
  async userExists(username: string): Promise<boolean> {
    return this.UserModel.findOne({ username }).then((res) => !!res);
  }

  // Add User to Database
  async addUser(username: string): Promise<IUserModel> {
    const userExists = await this.userExists(username);

    // If User does exist, no need to add new
    if (userExists) return null;

    // Create new User and save
    const newUser = new this.UserModel({ username });
    await newUser.save();

    return newUser;
  }

  async removeUser(username: string): Promise<boolean> {
    const userExists = await this.userExists(username);

    // If User does exist, no delete him, otherwise
    if (!userExists) return false;

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
