/* eslint-disable no-await-in-loop */
import * as dayjs from 'dayjs';

import { User } from '../leetcode/models';
import { getLeetcodeDataFromUsername } from '../leetcode';
import { log, delay } from '../utils/helper';
import { SERVER_MESSAGES as SM, BOT_MESSAGES as BM } from '../utils/dictionary';
import { constants } from '../utils/constants';

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
  )

  static delayTime: number = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  static delay: (msTime: number) => Promise<void> = delay;

  static lastRefreshedAt: dayjs.Dayjs = null;

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
        detail: BM.USERNAME_ALREADY_EXISTS(username),
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
            detail: BM.USERNAME_NOT_FOUND_ON_LEETCODE(username),
            user: null,
          };
        }

        // Add username to Database
        Cache.database.addUser(username, user);

        // Add User to Cache
        this.users.set(username.toLowerCase(), user);

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_ADDED(username),
          user,
        };
      })
      .catch((err: Error) => {
        log(err);
        return {
          status: constants.STATUS.ERROR,
          detail: BM.USERNAME_ADDING_ERROR(username),
          user: null,
        };
      });
  }

  /**
   * Get the user with the given username
   * @param {string} username - The username of the user to get.
   * @returns The user object.
   */
  static getUser(username: string): User {
    return this.users.get(username);
  }

  /**
   * Return an array of all the users in the users map
   * @returns An array of User objects.
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
   * @returns Nothing.
   */
  static addOrReplaceUser(username: string, user: User): void {
    // Get all Users
    const users = this.getAllUsers();

    // Replace User in Cache, if username was found
    for (let i = 0; i < users.length; i++) {
      if (users[i].username.toLowerCase() === username.toLowerCase()) {
        this.users.set(users[i].username, user);
        return;
      }
    }

    // If user was not found in Cache, add User to Cache
    this.users.set(username, user);
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
      log(SM.CACHE_ALREADY_REFRESHED);
      return {
        status: constants.STATUS.ERROR,
        detail: BM.CACHE_ALREADY_REFRESHED,
      };
    }

    // Set database refresh time
    this.lastRefreshedAt = now;

    // Log when refresh started
    log(SM.DATABASE_STARTED_REFRESH(now.format(DATE_FORMAT)));

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
          log(SM.USERNAME_WAS_REFRESHED(username));
        } else {
          log(SM.USERNAME_WAS_NOT_REFRESHED(username));
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
    log(SM.DATABASE_FINISHED_REFRESH(dayjs().format(DATE_FORMAT)));

    // Set database refresh time
    this.lastRefreshedAt = now;

    return {
      status: constants.STATUS.SUCCESS,
      detail: BM.CACHE_IS_REFRESHED,
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
            detail: BM.USERNAME_NOT_FOUND(username),
          };
        }

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_DELETED(username),
        };
      })
      .catch((err) => {
        log(err);

        return {
          status: constants.STATUS.ERROR,
          detail: BM.ERROR_ON_THE_SERVER,
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
