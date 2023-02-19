/* eslint-disable no-await-in-loop */
import * as dayjs from 'dayjs';

import { User } from '../leetcode/models';
import { getLeetcodeDataFromUsername } from '../leetcode';
import { log, delay } from '../utils/helper';
import { constants } from '../global/constants';
import {
  RefreshMessages,
  UserMessages,
  ErrorMessages,
} from '../global/messages';

import { CacheResponse, UserCacheResponse } from './models';

import Cache from './index';

const { DATE_FORMAT } = constants.SYSTEM;

/**
 * The UserCache class is used to cache Users that are saved in Database for
 * quick access.
 * */
export class UserCache {
  static users: Map<string, User> = new Map<string, User>();

  static getLeetcodeDataFromUsername: (username: string) => Promise<User> = (
    getLeetcodeDataFromUsername
  );

  static delayTime: number = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  static delay: (msTime: number) => Promise<void> = delay;

  static lastRefreshedAt?: dayjs.Dayjs;

  /**
   * Get the number of users in the database.
   * @returns The number of users in the database.
   */
  static get userAmount(): number {
    return this.getAllUsers().length;
  }

  /**
   * If the user exists in the database, return an error.
   * Otherwise, get the user from LeetCode and add it to the database.
   * @param {string} username - string
   * @returns A Promise<UserCacheResponse>
   */
  static async addUser(username: string): Promise<UserCacheResponse> {
    const userExists = await Cache.database.userExists(username);

    // Check if User already exists in Database
    if (userExists) {
      return {
        status: constants.STATUS.ERROR,
        detail: UserMessages.userAlreadyExistsInThisChannel(username),
        user: null,
      };
    }

    // First get LeetCode User from username
    return this.getLeetcodeDataFromUsername(username)
      .then((user: User) => {
        // If User does NOT exist in LeetCode, return null
        if (!user.exists) {
          return {
            status: constants.STATUS.ERROR,
            detail: UserMessages.userNotFoundInLeetcode(username),
            user: null,
          };
        }

        // Add username to Database
        Cache.database.addUser(username, user);

        // Add User to Cache
        this.users.set(username.toLowerCase(), user);

        return {
          status: constants.STATUS.SUCCESS,
          detail: UserMessages.userIsSuccessfullyAdded(username),
          user,
        };
      })
      .catch((err: Error) => {
        log(err);
        return {
          status: constants.STATUS.ERROR,
          detail: ErrorMessages.unknownError(username),
          user: null,
        };
      });
  }

  /**
   * Get the user with the given username
   * @param {string} username - The username of the user to get.
   * @returns User.
   */
  static getUser(username: string): User {
    return this.users.get(username);
  }

  /**
   * Return an array of all the users in the users map
   * @returns User[].
   */
  static getAllUsers(): User[] {
    return [...this.users.values()];
  }

  /**
   * If the username is already in the cache, replace the user in the cache
   * with the new user. If the username is not in the cache, add the user
   * to the cache
   * @param {string} username - The username of the user.
   * @param {User} user - User
   */
  static addOrReplaceUser(username: string, user: User): void {
    // Get all Users
    const users = this.getAllUsers();

    // Replace User in Cache, if username was found
    for (let i = 0; i < users.length; i++) {
      if (users[i].username.toLowerCase() === username.toLowerCase()) {
        this.users.set(users[i].username, user);

        // Update User Data asynchronously
        Cache.database.updateUser(username, user);

        return;
      }
    }

    // If user was not found in Cache, add User to Cache
    this.users.set(username, user);
  }

  /**
   * Function that loads all the users from the database into the cache from
   * JSON data that is saved. After that, it refreshes users asynchronously.
   */
  static async preload(): Promise<void> {
    const users = await Cache.database.findAllUsers();

    users.forEach((user) => {
      if (user.data) {
        this.addOrReplaceUser(user.username, JSON.parse(user.data));
      }
    });

    // Refresh users asynchronously
    this.refresh();
  }

  /**
   * Load all Users from Database, refresh them with newest data from LeetCode,
   * and replace them in Cache
   * @returns A Promise<UserCacheResponse>
   */
  static async refresh(): Promise<UserCacheResponse> {
    const now = dayjs();
    const { lastRefreshedAt } = this;

    // If database was refreshed less than 15 minutes ago
    if (lastRefreshedAt && now.diff(lastRefreshedAt, 'minutes') < 5) {
      log(RefreshMessages.cacheAlreadyRefreshed);
      return {
        status: constants.STATUS.ERROR,
        detail: RefreshMessages.cacheAlreadyRefreshed,
      };
    }

    // Set database refresh time
    this.lastRefreshedAt = now;

    // Log when refresh started
    log(RefreshMessages.refreshWasRequested);

    try {
      // Load all Users from Database
      const users = await Cache.database.findAllUsers();

      // Refresh users with newest data from LeetCode
      for (let i = 0; i < users.length; i++) {
        // Get username from Cache User
        const { username } = users[i];

        // Get data from LeetCode related to this User
        // eslint-disable-next-line no-await-in-loop
        const userData = await this.getLeetcodeDataFromUsername(username);

        // If User Data was returned from LeetCode, replace User in Cache
        if (userData.exists) {
          this.addOrReplaceUser(username, userData);
          log(RefreshMessages.usernameWasRefreshed(username));
        } else {
          log(RefreshMessages.usernameWasNotRefreshed(username));
        }

        // Wait X seconds until loading next User, X is set in .env
        await this.delay(this.delayTime);
      }
    } catch (err) {
      log(err.message);
    }

    // Re-sort users after refresh
    const allChannels = [...Cache.channels.values()];
    allChannels.forEach((channel) => channel.sortUsers());

    // Log when refresh ended
    log(RefreshMessages.databaseRequestedRefresh(dayjs().format(DATE_FORMAT)));

    // Set database refresh time
    this.lastRefreshedAt = now;

    return {
      status: constants.STATUS.SUCCESS,
      detail: RefreshMessages.cacheIsRefreshed,
    };
  }

  /**
   * Remove a user from the database and the cache.
   * @param {string} username - The username of the user to be deleted.
   * @returns A Promise<UserCacheResponse>
   */
  static async removeUser(username: string): Promise<CacheResponse> {
    return Cache.database
      .removeUser(username)
      .then((isDeleted) => {
        // Remove from Cache
        this.users.delete(username.toLowerCase());

        if (!isDeleted) {
          return {
            status: constants.STATUS.ERROR,
            detail: UserMessages.userDoesNotExistInThisChannel(username),
          };
        }

        return {
          status: constants.STATUS.SUCCESS,
          detail: UserMessages.userIsSuccessfullyDeleted(username),
        };
      })
      .catch((err) => {
        log(err);

        return {
          status: constants.STATUS.ERROR,
          detail: ErrorMessages.server(),
        };
      });
  }

  /**
   * Clear the cache from Users and remove them from Database
   */
  static async clear(): Promise<void> {
    await Cache.database.removeAllUsers();
    this.users.clear();
  }
}
