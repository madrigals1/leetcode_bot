import { DataTypes, Sequelize, Op } from 'sequelize';

import { log } from '../../utils/helper';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import DatabaseProvider from '../database.proto';
import { DatabaseUser, DatabaseChannelUser, DatabaseChannel } from '../models';
import {
  ChannelKey, User, Channel, ChannelUser,
} from '../../cache/models';
import { constants } from '../../utils/constants';
import { usernameFindOptions, usernameUpdateOptions } from '../utils';
import { User as LeetCodeUser } from '../../leetcode/models';

class SQLite extends DatabaseProvider {
  providerName = 'SQLite';

  sequelize: Sequelize;

  User: typeof DatabaseUser = DatabaseUser;

  Channel: typeof DatabaseChannel = DatabaseChannel;

  ChannelUser: typeof DatabaseChannelUser = DatabaseChannelUser;

  initialize(): void {
    this.sequelize = new Sequelize('sqlite::memory:', {
      storage: `database/sqlite3/${constants.DATABASE.SQLITE3.FILENAME}`,
      logging: false,
    });

    this.User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, { sequelize: this.sequelize, modelName: 'users' });

    this.Channel.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chat_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, { sequelize: this.sequelize, modelName: 'channels' });

    this.ChannelUser.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, { sequelize: this.sequelize, modelName: 'channel_users' });

    log(SM.IS_CONNECTING(this.providerName));
  }

  // Connect to Database
  async connect(): Promise<boolean> {
    this.initialize();

    return this.sequelize
      .sync()
      .then(() => true)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return this.User
      .findAll()
      .then((users: DatabaseUser[]) => users.map((user) => ({
        id: user.id,
        username: user.username,
        data: user.data,
      })))
      .catch((err) => {
        log(err);
        return [];
      });
  }

  // Load User by `username`
  async userExists(username: string): Promise<boolean> {
    return this.User
      .findOne(usernameFindOptions(username))
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Add User to Database
  async addUser(username: string, user: LeetCodeUser): Promise<User> {
    // Check if user already exists is in database
    const userExists = await this.userExists(username);

    // If user already exists, do not add User to Database
    if (userExists) return null;

    return this.User
      .create({ username: username.toLowerCase(), data: JSON.stringify(user) })
      .then((foundUser: DatabaseUser) => ({
        id: foundUser.id,
        username: foundUser.username,
        data: foundUser.data,
      }))
      .catch((err) => {
        log(err);
        return null;
      });
  }

  // Update User in Database
  async updateUser(username: string, user: LeetCodeUser): Promise<boolean> {
    // Check if user exists is in database
    const userExists = await this.userExists(username);

    // If user does not exist, return false
    if (!userExists) return false;

    return this.User
      .update({ data: JSON.stringify(user) }, usernameUpdateOptions(username))
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Remove User from Database
  async removeUser(username: string): Promise<boolean> {
    // Check if user exists is in database
    const userExists = await this.userExists(username);

    // If user does not exist, return false
    if (!userExists) return false;

    return this.User
      .destroy(usernameFindOptions(username))
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<boolean> {
    return this.User
      .destroy({ truncate: true })
      .then(() => true)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  // Add Channel
  async addChannel(channel: Channel): Promise<Channel> {
    const { chatId, provider } = channel.key;

    // Create Channel
    return this.Channel
      .create({
        chat_id: chatId,
        provider,
        user_limit: 1000,
      })
      .then((res) => {
        if (!res) return null;
        return { ...channel, id: res.id };
      })
      .catch((err) => {
        log(err);
        return null;
      });
  }

  async getAllChannels(): Promise<Channel[]> {
    return this.Channel
      .findAll()
      .then((channels: DatabaseChannel[]) => channels
        .map((channel: DatabaseChannel) => ({
          id: channel.id,
          key: {
            chatId: channel.chat_id,
            provider: channel.provider,
          },
          userLimit: channel.user_limit,
        })))
      .catch((err) => {
        log(err);
        return [];
      });
  }

  async getChannel(channelKey: ChannelKey): Promise<Channel> {
    const { chatId, provider } = channelKey;

    return this.Channel
      .findOne({ where: { chat_id: chatId, provider } })
      .then((channel: DatabaseChannel) => {
        if (!channel) return null;
        return {
          id: channel.id,
          chat_id: channel.chat_id,
          provider: channel.provider,
          userLimit: channel.user_limit,
        };
      })
      .catch((err) => {
        log(err);
        return null;
      });
  }

  async getUsersForChannel(channelKey: ChannelKey): Promise<string[]> {
    const channel = await this.getChannel(channelKey);

    if (!channel) return [];

    return this.ChannelUser
      .findAll({ where: { channel_id: channel.id } })
      .then((res) => res.map((row) => row.username))
      .catch((err) => {
        log(err);
        return [];
      });
  }

  async deleteChannel(channelKey: ChannelKey): Promise<boolean> {
    const { chatId, provider } = channelKey;

    return this.Channel
      .destroy({ where: { chat_id: chatId, provider } })
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  async deleteAllChannels(): Promise<boolean> {
    return this.Channel
      .destroy({ truncate: true })
      .then(() => true)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<ChannelUser> {
    const channel = await this.getChannel(channelKey);

    if (!channel) throw new Error(SM.CHANNEL_DOES_NOT_EXIST(channelKey));

    const usersInChannel = await this.getUsersForChannel(channelKey);

    if (usersInChannel.includes(username)) return null;

    return this.ChannelUser
      .create({
        channel_id: channel.id,
        username: username.toLowerCase(),
      })
      .then((res) => ({
        id: res.id,
        channelId: res.channel_id,
        username: res.username,
      }))
      .catch((err) => {
        log(err);
        return null;
      });
  }

  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(channelKey);

    if (!channel) return false;

    return this.ChannelUser
      .destroy({
        where: {
          [Op.and]: [
            usernameFindOptions(username).where,
            { channel_id: channel.id },
          ],
        },
      })
      .then((res) => !!res)
      .catch((err) => {
        log(err);
        return false;
      });
  }

  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    const channel = await this.getChannel(channelKey);

    if (!channel) return false;

    return this.ChannelUser
      .destroy({ where: { channel_id: channel.id } })
      .then(() => true)
      .catch((err) => {
        log(err);
        return false;
      });
  }
}

export default SQLite;
