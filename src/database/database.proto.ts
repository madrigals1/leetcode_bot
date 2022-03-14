/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */

import * as dayjs from 'dayjs';

import { ChannelData, ChannelKey } from '../cache/models';

/**
 * The DatabaseProvider class is a class that provides an interface to the
 * database. It has a number of methods that are used to interact with the
 * database.
 */
class DatabaseProvider {
  providerName = 'prototype';

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
  async userExists(username: string): Promise<boolean> {
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
   * It deletes a channel.
   * @param {ChannelKey} channelKey - The key of the channel to delete.
   */
  async deleteChannel(channelKey: ChannelKey): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * It deletes all channels.
   */
  async deleteAllChannels(): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * It adds a user to a channel.
   * @param {ChannelKey} channelKey - The key of the channel to add the user to.
   * @param {string} username - The username of the user to add to the channel.
   */
  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Remove a user from a channel
   * @param {ChannelKey} channelKey - The key of the channel to remove the user
   * from.
   * @param {string} username - The username of the user to remove from the
   * channel.
   */
  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Clear a channel
   * @param {ChannelKey} channelKey - The key of the channel to clear.
   */
  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    throw new Error('Not Implemented');
  }
}

export default DatabaseProvider;
