import * as _ from 'lodash';

import { User } from '../leetcode/models';
import { log } from '../utils/helper';
import { constants } from '../utils/constants';
import { BOT_MESSAGES as BM } from '../utils/dictionary';

import { Channel, CacheResponse, UserCacheResponse } from './models';
import { UserCache } from './userCache';

import Cache from './index';

export class ChannelCache {
  usernames: string[] = [];

  channel: Channel = null;

  /**
   * Save channel in this Channel
   * @param {Channel} channel - The channel data object.
   */
  constructor(channel: Channel) {
    this.channel = channel;
  }

  /**
   * Return an array of users.
   *
   * Each user is retrieved from the UserCache
   * @returns List of Users.
   */
  get users(): User[] {
    return this.usernames.map((username) => UserCache.getUser(username));
  }

  /**
   * Gets all users for this Channel and add their usernames to usernames array.
   * Sorts users by amount of solved problems.
   * @returns Promise with void
   */
  async preload(): Promise<void> {
    return Cache.database.getUsersForChannel(this.channel.key)
      .then((usernameList) => {
        usernameList.forEach((username) => {
          if (UserCache.getUser(username) !== undefined) {
            this.usernames.push(username);
          }
        });
        this.sortUsers();
      })
      .catch((err) => { log(err); });
  }

  /**
   * Get the number of users in this Channel.
   * @returns The number of users in this Channel.
   */
  get userAmount(): number {
    return this.usernames.length;
  }

  /**
   * If the user is already in the UserCache, return it. If not, add it to the
   * UserCache and return it
   * @param {string} username - The username of the user to get or add.
   * @returns The promise with UserCacheResponse.
   */
  // eslint-disable-next-line class-methods-use-this
  private async getOrAddUser(username: string): Promise<UserCacheResponse> {
    // Get User from UserCache
    const user = UserCache.getUser(username);

    // If User is found in UserCache, return it
    if (user) {
      return {
        user,
        status: constants.STATUS.SUCCESS,
        detail: '',
      };
    }

    // If User was not found in UserCache, add it
    return UserCache.addUser(username);
  }

  /**
   * Add a user to the channel
   * @param {string} username - The username of the user that is being added
   * to the channel.
   * @returns A Promise with CacheResponse.
   */
  async addUser(username: string): Promise<CacheResponse> {
    const addOrGetUserResponse = await this.getOrAddUser(username);

    if (addOrGetUserResponse.status === constants.STATUS.ERROR) {
      return {
        status: constants.STATUS.ERROR,
        detail: addOrGetUserResponse.detail,
      };
    }

    // Add User to Channel in Database
    return Cache.database
      .addUserToChannel(this.channel.key, username)
      .then((addedToDB) => {
        if (!addedToDB) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_ALREADY_EXISTS(username),
          };
        }

        // Add User to Cache
        this.usernames.push(username);

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
   * @returns A Promise with CacheResponse.
   */
  async removeUser(username: string): Promise<CacheResponse> {
    // Remove User from Channel in Database
    return Cache.database
      .removeUserFromChannel(this.channel.key, username)
      .then((deletedFromDB) => {
        if (!deletedFromDB) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.USERNAME_DOES_NOT_EXIST_IN_CHANNEL(username),
          };
        }

        // Remove username from Channel
        _.remove(
          this.usernames,
          (existingUsername) => existingUsername === username,
        );

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
   * Return user with given username
   * @param {string} username - username of user to get.
   * @returns User.
   */
  loadUser(username: string): User {
    if (!this.usernames.includes(username)) {
      return undefined;
    }

    return UserCache.getUser(username);
  }

  /**
   * Sort the users by the number of solved problems
   */
  sortUsers(): void {
    // Sort Users
    const sortedUsers = this.users.sort(
      (user1, user2) => {
        const solved1 = user1.solved !== undefined ? user1.solved : -Infinity;
        const solved2 = user2.solved !== undefined ? user2.solved : -Infinity;
        return solved2 - solved1;
      },
    );

    // Set usernames for Users
    this.usernames = sortedUsers.map((user) => user.username);
  }

  /**
   * It clears the this Channel from users
   * @returns A promise with CacheResponse
   */
  async clear(): Promise<CacheResponse> {
    return Cache.database.clearChannel(this.channel.key)
      .then((cleared) => {
        if (!cleared) {
          return {
            status: constants.STATUS.ERROR,
            detail: BM.CHANNEL_WAS_NOT_CLEARED,
          };
        }

        // Clear Users Cache
        this.usernames.length = 0;

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
