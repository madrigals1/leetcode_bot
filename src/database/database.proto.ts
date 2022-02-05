/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */

import dayjs from 'dayjs';

import { ChannelData, ChannelKey } from '../cache/models/channel.model';

/**
 * The DatabaseProvider class is a class that provides an interface to the
 * database. It has a number of methods that are used to interact with the
 * database.
 */
class DatabaseProvider {
  providerName = 'prototype';

  lastRefreshTime: dayjs.Dayjs;

  /**
   * Connect to the database and return a promise that resolves to the
   * connection object.
   */
  async connect(): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Find all users.
   */
  async findAllUsers(): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Load a user from the database.
   * The function signature is:
   * @param {string} username - The username of the user to load.
   */
  async loadUser(username: string): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Add a user to the database.
   * @param {string} username - The username of the user to add.
   */
  async addUser(username: string): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Remove a user from the database.
   * @param {string} username - The username of the user to remove.
   */
  async removeUser(username: string): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Remove all users from the database.
   */
  async removeAllUsers(): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Create `Channel` using given channelData
   * @param {ChannelData} channelData - IChannel
   */
  async addChannel(channelData: ChannelData): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * It returns Channel list as an array of strings.
   */
  async getAllChannels(): Promise<ChannelData[]> {
    throw new Error('Not Implemented');
  }

  /**
   * It returns a channel.
   * @param {ChannelKey} channelKey - The key of the channel to get.
   */
  async getChannel(channelKey: ChannelKey): Promise<ChannelData> {
    throw new Error('Not Implemented');
  }

  /**
   * It returns a list of users for a given Channel.
   * @param {ChannelKey} channelKey - The key of the Channel you want to get the
   * users for.
   */
  async getUsersForChannel(channelKey: ChannelKey): Promise<string[]> {
    throw new Error('Not Implemented');
  }

  /**
   * Delete `Channel` using channelId
   * @param {number} channelId - number - The ID of the channel to delete.
   */
  async deleteChannel(channelId: number): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * It adds a user to a `Channel`.
   * @param {number} channelId - The id of the `Channel` to add the `User` to.
   * @param {string} username - The username of the `User` you want to add to
   * the `Channel`.
   */
  async addUserToChannel(channelId: number, username: string): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * It removes a user from a `Channel`.
   * @param {number} channelId - The id of the `Channel` to remove the `User`
   * from.
   * @param {string} username - The username of the `User` to remove from the
   * `Channel`.
   */
  async removeUserFromChannel(
    channelId: number, username: string,
  ): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Clear a `Channel` from all `Users`
   * @param {number} channelId - The id of the `Channel` to clear.
   */
  async clearChannel(channelId: number): Promise<boolean> {
    throw new Error('Not Implemented');
  }
}

export default DatabaseProvider;
