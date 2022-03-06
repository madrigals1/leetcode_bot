/* eslint-disable class-methods-use-this */
import * as _ from 'lodash';

import { User } from '../leetcode/models';
import { log } from '../utils/helper';
import { constants } from '../utils/constants';
import { BOT_MESSAGES as BM } from '../utils/dictionary';

import { ChannelData } from './models/channel.model';
import { CacheResponse } from './models/response.model';
import { UserCache } from './userCache';

import Cache from './index';

export class ChannelCache {
  users: User[] = [];

  channelData: ChannelData = null;

  /**
   * It takes a channel object as a parameter and assigns it to the channelData
   * property
   * @param {ChannelData} channel - The channel data object.
   */
  constructor(channel: ChannelData) {
    this.channelData = channel;
  }

  /**
   * It gets all the users for the channel and adds them to the users array.
   * @returns A promise with void.
   */
  async preload(): Promise<void> {
    return Cache.database.getUsersForChannel(this.channelData.key)
      .then((usernameList) => {
        usernameList.forEach((username) => {
          this.users.push(UserCache.getUser(username));
        });
      })
      .catch((err) => { log(err); });
  }

  /**
   * Get the number of users in the system.
   * @returns The number of users in the array.
   */
  get userAmount(): number {
    return this.users.length;
  }

  /**
   * If the user is already in the cache, return it. If not, add it to the
   * cache and return it
   * @param {string} username - The username of the user to get or add.
   * @returns The promise with User object.
   */
  private async getOrAddUser(username: string): Promise<User> {
    // Get User from UserCache
    const user = UserCache.getUser(username);

    // If User is found in Cache, return it
    if (user) return user;

    // If User was not found in Cache, add it
    return UserCache.addUser(username).then((res) => res.user);
  }

  /**
   * Add a user to the channel
   * @param {string} username - The username of the user that is being added
   * to the channel.
   * @returns The return value is a Promise. The Promise is resolved with a
   * CacheResponse object.
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
    return Cache.database
      .addUserToChannel(this.channelData.key, username)
      .then((addedToDB) => {
        if (!addedToDB) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_ALREADY_EXISTS(username),
          };
        }

        // Block case, where we already have too many users
        const { userLimit } = this.channelData;
        if (this.userAmount >= userLimit) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_NOT_ADDED_USER_LIMIT(username, userLimit),
          };
        }

        // Add User to Cache
        this.users.push(addedUser);

        // Sort Users after adding new one
        this.sortUsers();

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_ADDED(username),
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
   * Remove a user from the channel
   * @param {string} username - The username of the user to be removed.
   * @returns The return value is a Promise. The Promise is resolved with a
   * CacheResponse object.
   */
  async removeUser(username: string): Promise<CacheResponse> {
    const usernameLower = username.toLowerCase();

    // Remove User from Channel in Database
    return Cache.database
      .removeUserFromChannel(this.channelData.key, usernameLower)
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
   * Given a username, return the user object.
   * @param {string} username - string
   * @returns The user object that matches the username.
   */
  loadUser(username: string): User {
    return this.users.find((user) => user.username === username);
  }

  /**
   * Sort the users by the number of solved problems
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
   * It clears the channel's cache
   * @returns A promise with CacheResponse
   */
  async clear(): Promise<CacheResponse> {
    return Cache.database.clearChannel(this.channelData.key)
      .then((cleared) => {
        if (!cleared) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.CHANNEL_WAS_NOT_CLEARED,
          };
        }

        // Clear Users Cache
        this.users.length = 0;

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
