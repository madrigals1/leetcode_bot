/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import dayjs from 'dayjs';

import { IChannel } from '../cache/models/channel.model';

/**
 * The DatabaseProvider class is a class that provides an interface to the
 * database. It has a number of methods that are used to interact with the
 * database.
 */
class DatabaseProvider {
  isRefreshing = false;

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
   * @param {IChannel} channelData - IChannel
   */
  async addChannel(channelData: IChannel): Promise<any> {
    throw new Error('Not Implemented');
  }

  /**
   * Delete `Channel` using channelId
   * @param {number} channelId - number - The ID of the channel to delete.
   */
  async deleteChannel(channelId: number): Promise<any> {
    throw new Error('Not Implemented');
  }
}

export default DatabaseProvider;
