import { error, log } from '../../utils/helper';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import DatabaseProvider from '../database.proto';
import { User, ChannelUser, Channel } from '../models';

import { sequelize } from './helper';

class Postgres extends DatabaseProvider {
  sequelize = sequelize;

  User: typeof User = User;

  Channel: typeof Channel = Channel;

  ChannelUser: typeof ChannelUser = ChannelUser;

  // Connect database
  async connect(): Promise<boolean> {
    return this.sequelize
      .sync()
      .then(() => {
        log(SM.CONNECTION_STATUS.SUCCESSFUL);
        return true;
      })
      .catch((err) => {
        log(SM.CONNECTION_STATUS.ERROR(err));
        return false;
      });
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return this.User
      .findAll()
      .catch((err) => {
        log(err);
        return [];
      });
  }

  // Load User by `username`
  async userExists(username: string): Promise<boolean> {
    return this.User
      .findOne({ where: { username } })
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Add User to Database
  async addUser(username: string): Promise<User> {
    // Check if user already exists is in database
    const userExists = await this.userExists(username);

    // If user already exists, do not add User to Database
    if (userExists) return null;

    return this.User
      .create({ username })
      .catch((err) => {
        log(err);
        return null;
      });
  }

  // Remove User from Database
  async removeUser(username: string): Promise<boolean> {
    // Check if user exists is in database
    const userExists = await this.userExists(username);

    // If user does not exist, return false
    if (!userExists) return false;

    return this.User
      .destroy()
      .then(() => true)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<boolean> {
    return this.User
      .destroy()
      .then((res) => !!res)
      .catch((err) => {
        error(err);
        return false;
      });
  }
}

export default Postgres;
