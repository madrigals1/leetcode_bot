import { DataTypes, Sequelize } from 'sequelize';

import { log } from '../../utils/helper';
import DatabaseProvider from '../database.proto';
import { ChannelData, ChannelKey } from '../../cache/models';
import { User, Channel, ChannelUser } from '../models';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { constants } from '../../utils/constants';

class SQLite extends DatabaseProvider {
  providerName = 'SQLite';

  sequelize: Sequelize;

  User: typeof User = User;

  Channel: typeof Channel = Channel;

  ChannelUser: typeof ChannelUser = ChannelUser;

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
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      user_limit: {
        type: DataTypes.NUMBER,
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
        type: DataTypes.NUMBER,
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
      .destroy({ where: { username } })
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
  async addChannel(channelData: ChannelData): Promise<ChannelData> {
    const { chatId, provider } = channelData.key;
    const { userLimit } = channelData;

    // Create Channel
    return this.Channel
      .create({
        chat_id: chatId,
        provider,
        user_limit: userLimit,
      })
      .then((res) => {
        if (!res) return null;
        return { ...channelData, id: res.id };
      })
      .catch((err) => {
        log(err);
        return null;
      });
  }

  async getAllChannels(): Promise<ChannelData[]> {
    return this.Channel
      .findAll()
      .then((res) => res.map((channel) => ({
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

  async getChannel(channelKey: ChannelKey): Promise<ChannelData> {
    const { chatId, provider } = channelKey;

    return this.Channel
      .findOne({ where: { chat_id: chatId, provider } })
      .then((res) => {
        if (!res) return null;
        return {
          id: res.id,
          key: channelKey,
          userLimit: res.user_limit,
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
  ): Promise<User> {
    const channel = await this.getChannel(channelKey);

    if (!channel) return null;

    return this.ChannelUser
      .create({ channel_id: channel.id, username })
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
      .destroy({ where: { channel_id: channel.id, username } })
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
