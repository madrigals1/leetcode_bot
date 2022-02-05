/* eslint-disable class-methods-use-this */
import * as _ from 'lodash';

import { User } from '../leetcode/models';
import Database from '../database';
import { log } from '../utils/helper';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';

import { ChannelData } from './models/channel.model';
import { CacheResponse } from './models/response.model';
import { UserCache } from './userCache';

const { BOT_MESSAGES: BM } = dictionary;

export class ChannelCache {
  users: User[] = [];

  database = Database;

  channelData: ChannelData;

  /**
   * Create a new instance of the Channel class
   * @param {string} channelId - The channel ID of the Channel.
   */
  constructor(channel: ChannelData) {
    this.channelData = channel;
  }

  /**
   * Get the number of users in the Channel.
   * @returns The number of users in the Channel.
   */
  get userAmount(): number {
    return this.users.length;
  }

  /**
   * If the User is already in the Cache, return it. If not, add it to the Cache
   * and return it
   * @param {string} username - The username of the User to get or add.
   * @returns A User object.
   */
  private async getOrAddUser(username: string): Promise<User> {
    // Get User from UserCache
    const user = UserCache.getUser(username);

    // If User is found in Cache, return it
    if (user) return user;

    // If User was not found in Cache, add it
    return UserCache.addUser(username);
  }

  /**
   * Add a User to the Channel
   * @param {string} username - The username of the User that you want to add to
   * the Channel.
   */
  async addUser(username: string): Promise<CacheResponse> {
    const addedUser = await this.getOrAddUser(username);

    if (!addedUser) {
      return {
        status: constants.STATUS.ERROR,
        detail: BM.USERNAME_NOT_FOUND_ON_LEETCODE(username),
      };
    }

    // Add User to Channel in Database
    return this.database
      .addUserToChannel(this.channelData.id, username)
      .then((addedToDB) => {
        if (!addedToDB) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_ALREADY_EXISTS(username),
          };
        }

        // Add User to Cache
        this.users.push(addedUser);

        // Sort Users after adding new one
        this.sortUsers();

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_ADDED(
            username,
            this.userAmount,
            this.channelData.userLimit,
          ),
        };
      })
      .catch((err) => {
        log(err);

        // Send message as Internal Server Error
        return {
          status: constants.STATUS.ERROR,
          detail: BM.ERROR_ON_THE_SERVER,
        };
      });
  }

  /**
   * Remove a user from the Channel
   * @param {string} username - The username of the User to remove.
   */
  async removeUser(username: string): Promise<CacheResponse> {
    const usernameLower = username.toLowerCase();

    // Remove User from Channel in Database
    return this.database
      .removeUserFromChannel(this.channelData.id, usernameLower)
      .then((deletedFromDB) => {
        if (!deletedFromDB) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_WAS_NOT_DELETED(username),
          };
        }

        // Remove User from Cache
        _.remove(this.users, { username });

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_DELETED(username),
        };
      })
      .catch((err) => {
        log(err);

        // Send message as Internal Server Error
        return {
          status: constants.STATUS.ERROR,
          detail: BM.ERROR_ON_THE_SERVER,
        };
      });
  }

  /**
   * Return the User with the given username
   * @param {string} username - string
   * @returns The User object that matches the username.
   */
  loadUser(username: string): User {
    return this.users.find((user) => user.username === username);
  }

  /**
   * Sort the Users by the number of solved problems
   */
  private sortUsers(): void {
    this.users.sort(
      (user1, user2) => {
        const solved1 = user1.solved !== undefined ? user1.solved : -Infinity;
        const solved2 = user2.solved !== undefined ? user2.solved : -Infinity;
        return solved2 - solved1;
      },
    );
  }

  /**
   * Clear the Channel from all Users
   */
  clear(): Promise<CacheResponse> {
    return this.database.clearChannel(this.channelData.id)
      .then((cleared) => {
        if (!cleared) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.CHANNEL_WAS_NOT_CLEARED,
          };
        }

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.CHANNEL_WAS_CLEARED,
        };
      })
      .catch((err) => {
        log(err);

        // Send message as Internal Server Error
        return {
          status: constants.STATUS.ERROR,
          detail: BM.ERROR_ON_THE_SERVER,
        };
      });
  }
}
