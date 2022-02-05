/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import dayjs from 'dayjs';

import { User } from '../leetcode/models';
import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { log, delay } from '../utils/helper';
import { SERVER_MESSAGES as SM, BOT_MESSAGES as BM } from '../utils/dictionary';
import { constants } from '../utils/constants';

import { CacheResponse } from './models/response.model';

const { DATE_FORMAT } = constants.SYSTEM;

export class UserCache {
  static users: Map<string, User> = new Map<string, User>();

  static database = Database;

  static getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;

  static delayTime = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  static delay = delay;

  static lastRefreshedAt: dayjs.Dayjs;

  /**
   * Get the number of users in the database.
   * @returns The number of users in the database.
   */
  static get userAmount(): number {
    return this.getAllUsers().length;
  }

  /**
   * If the user exists in LeetCode, add the User to the Database and Cache
   * @param {string} username - The username of the User you want to add to the
   * Database.
   * @returns A Promise with User.
   */
  static addUser(username: string): Promise<User> {
    // First get LeetCode User from username
    return this.getLeetcodeDataFromUsername(username)
      .then((user: User) => {
        // If User does NOT exist in LeetCode, return null
        if (!user.exists) return null;

        // Add username to Database
        this.database.addUser(username);

        // Add User to Cache
        this.users.set(username, user);

        return user;
      })
      .catch((err) => {
        log(err);
        return null;
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
   * @returns An array of all the users in the users map.
   */
  static getAllUsers(): User[] {
    return [...this.users.values()];
  }

  /**
   * If the username is already in the cache, replace the user object.
   * Otherwise, add the user object to the cache
   * @param {string} username - string
   * @param {User} user - User
   * @returns Nothing.
   */
  static addOrReplaceUser(username: string, user: User): void {
    // Replace User in Cache, if username was found
    for (let i = 0; i < this.userAmount; i++) {
      if (this.users[i].username.toLowerCase() === username.toLowerCase()) {
        this.users[i] = user;
        return;
      }
    }

    // If user was not found in Cache, add User to Cache
    this.users.set(username, user);
  }

  /**
   * It iterates over all Users in the Database and tries to get the
   * newest data from LeetCode for each User.
   *
   * - If the User exists on LeetCode, the User is updated
   * in the Cache.
   * - If the User does NOT exist on LeetCode, the User is removed
   * from the Cache.
   *
   * Can also be used to pre-load all Users from Database.
   */
  static async refresh(): Promise<CacheResponse> {
    const now = dayjs();
    const { lastRefreshedAt } = this;

    // If database was refreshed less than 15 minutes ago
    if (lastRefreshedAt && now.diff(lastRefreshedAt, 'minutes') < 15) {
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
      const users = await this.database.findAllUsers();

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

    // Log when refresh ended
    log(SM.DATABASE_FINISHED_REFRESH(dayjs().format(DATE_FORMAT)));

    return {
      status: constants.STATUS.SUCCESS,
      detail: BM.CACHE_IS_REFRESHED,
    };
  }

  /**
   * Clear the users list
   */
  static clear(): void {
    this.users.clear();
  }
}
