import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { log } from '../../utils/helper';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { constants } from '../../utils/constants';
import DatabaseProvider from '../database.proto';
import { ChannelData, ChannelKey } from '../../cache/models/channel.model';

import QUERIES from './queries';

class SQLite extends DatabaseProvider {
  database;

  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sqlite3filename = constants.DATABASE.SQLITE3.FILENAME;

      // Create database connection
      open({
        filename: `database/sqlite3/${sqlite3filename}`,
        driver: sqlite3.Database,
      })
        .then(async (database) => {
          // Log that database is connected
          log(SM.CONNECTION_STATUS.SUCCESSFUL);

          // Set database object
          this.database = database;

          // Create database table
          await this.createTables();

          resolve(true);
        })
        .catch((err) => {
          // Log that database connection had errors
          log(SM.CONNECTION_STATUS.ERROR(err));

          reject(Error(err));
        });
    });
  }

  // Create Tables
  private async createTables(): Promise<void> {
    // Create Users Table
    await this.database
      .run(QUERIES.CREATE_USERS_TABLE)
      .catch((err) => log(err));

    // Create Channels Table
    await this.database
      .run(QUERIES.CREATE_CHANNELS_TABLE)
      .catch((err) => log(err));

    // Create Channel Users Table
    await this.database
      .run(QUERIES.CREATE_CHANNEL_USERS_TABLE)
      .catch((err) => log(err));
  }

  // Find all Users
  async findAllUsers(): Promise<unknown> {
    return this.database
      .all(QUERIES.FIND_ALL_USERS)
      .catch((err) => log(err));
  }

  // Load User by `username`
  async userExists(username: string): Promise<boolean> {
    return this.database
      .get(QUERIES.LOAD_USER, username)
      .then((res) => !!res)
      .catch((err) => log(err));
  }

  // Add User to Database
  async addUser(username: string): Promise<unknown> {
    // Check if user already exists is in database
    const userExists = await this
      .userExists(username)
      .catch((err) => log(err));

    // If user already exists, do not add User to Database
    if (userExists) return false;

    return this.database
      .run(QUERIES.ADD_USER, username)
      .catch((err) => log(err));
  }

  // Remove User from Database
  async removeUser(username: string): Promise<unknown> {
    // Check if user exists is in database
    const userExists = await this
      .userExists(username)
      .catch((err) => log(err));

    // If user does not exist, return false
    if (!userExists) return false;

    return this.database
      .run(QUERIES.REMOVE_USER, username)
      .catch((err) => log(err));
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<unknown> {
    return this.database
      .run(QUERIES.REMOVE_ALL_USERS)
      .catch((err) => log(err));
  }

  async addChannel(channelData: ChannelData): Promise<ChannelData> {
    const { chatId, provider } = channelData.key;
    const { userLimit } = channelData;

    // Create Channel
    const result = await this.database
      .run(QUERIES.CREATE_CHANNEL, chatId, provider, userLimit)
      .catch((err) => log(err));

    return { ...channelData, id: result.lastID };
  }

  async getAllChannels(): Promise<ChannelData[]> {
    const result = await this.database
      .all(QUERIES.GET_ALL_CHANNELS)
      .catch((err) => log(err));

    return result.map((channel) => ({
      id: channel.id,
      key: {
        chatId: channel.chat_id,
        provider: channel.provider,
      },
      userLimit: channel.user_limit,
    }));
  }

  async getChannel(channelKey: ChannelKey): Promise<ChannelData> {
    const { chatId, provider } = channelKey;

    const result = await this.database
      .get(QUERIES.GET_CHANNEL, chatId, provider)
      .catch((err) => log(err));

    return {
      id: result.id,
      key: channelKey,
      userLimit: result.user_limit,
    };
  }

  async getUsersForChannel(channelKey: ChannelKey): Promise<string[]> {
    const { chatId, provider } = channelKey;

    const result = await this.database
      .all(QUERIES.GET_USERS_FOR_CHANNEL, chatId, provider)
      .catch((err) => log(err));

    return result?.map((row) => row.username);
  }

  async deleteChannel(channelKey: ChannelKey): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database
      .run(QUERIES.DELETE_CHANNEL, chatId, provider)
      .catch((err) => log(err));

    return true;
  }

  async deleteAllChannels(): Promise<boolean> {
    await this.database
      .run(QUERIES.DELETE_ALL_CHANNELS)
      .catch((err) => log(err));

    return true;
  }

  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database
      .run(QUERIES.ADD_USER_TO_CHANNEL, username, chatId, provider)
      .catch((err) => log(err));

    return true;
  }

  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database
      .run(QUERIES.REMOVE_USER_FROM_CHANNEL, username, chatId, provider)
      .catch((err) => log(err));

    return true;
  }

  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database
      .run(QUERIES.CLEAR_CHANNEL, chatId, provider)
      .catch((err) => log(err));

    return true;
  }
}

export default SQLite;
