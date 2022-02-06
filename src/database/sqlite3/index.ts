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
        .then((database) => {
          // Log that database is connected
          log(SM.CONNECTION_STATUS.SUCCESSFUL);

          // Set database object
          this.database = database;

          // Create database table
          this.createTables();

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
  private createTables(): void {
    // Create Users Table
    this.database.run(QUERIES.CREATE_USERS_TABLE);

    // Create Channels Table
    this.database.run(QUERIES.CREATE_CHANNELS_TABLE);

    // Create Channel Users Table
    this.database.run(QUERIES.CREATE_CHANNEL_USERS_TABLE);
  }

  // Find all Users
  async findAllUsers(): Promise<unknown> {
    return this.database.all(QUERIES.FIND_ALL_USERS);
  }

  // Load User by `username`
  async loadUser(username: string): Promise<unknown> {
    return this.database.get(QUERIES.LOAD_USER, username);
  }

  // Add User to Database
  async addUser(username: string): Promise<unknown> {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.database.run(QUERIES.ADD_USER, username);
  }

  // Remove User from Database
  async removeUser(username: string): Promise<unknown> {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.database.run(QUERIES.REMOVE_USER, username);
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<unknown> {
    return this.database.run(QUERIES.REMOVE_ALL_USERS);
  }

  async addChannel(channelData: ChannelData): Promise<ChannelData> {
    const { chatId, provider } = channelData.key;
    const { userLimit } = channelData;

    const result = await this.database.get(
      QUERIES.CREATE_CHANNEL, chatId, provider, userLimit,
    );

    return {
      ...channelData,
      id: result.id,
    };
  }

  async getAllChannels(): Promise<ChannelData[]> {
    const result = await this.database.all(QUERIES.GET_ALL_CHANNELS);

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

    const result = (
      await this.database.get(QUERIES.GET_CHANNEL, chatId, provider)
    );

    return {
      id: result.id,
      key: channelKey,
      userLimit: result.user_limit,
    };
  }

  async getUsersForChannel(channelKey: ChannelKey): Promise<string[]> {
    const { chatId, provider } = channelKey;

    const result = (
      await this.database.get(QUERIES.GET_USERS_FOR_CHANNEL, chatId, provider)
    );

    return result.map((row) => row.username);
  }

  async deleteChannel(channelKey: ChannelKey): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database.run(QUERIES.DELETE_CHANNEL, chatId, provider);

    return true;
  }

  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database.run(
      QUERIES.ADD_USER_TO_CHANNEL, username, chatId, provider,
    );

    return true;
  }

  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database.run(
      QUERIES.REMOVE_USER_FROM_CHANNEL, username, chatId, provider,
    );

    return true;
  }

  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    const { chatId, provider } = channelKey;

    await this.database.run(QUERIES.CLEAR_CHANNEL, chatId, provider);

    return true;
  }
}

export default SQLite;
