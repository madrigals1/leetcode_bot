/* eslint-disable no-await-in-loop */
import * as dayjs from 'dayjs';

import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { log, delay } from '../utils/helper';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';

import { CacheResponse } from './models/response.model';
import { Channel } from './channel';

const { DATE_FORMAT } = constants.SYSTEM;
const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

class Cache {
  channels: Channel[] = [];

  database = Database;

  userLimit: number = constants.SYSTEM.USER_AMOUNT_LIMIT;

  getLeetcodeDataFromUsername: CallableFunction = getLeetcodeDataFromUsername;

  delayTime: number = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  delay = delay;

  lastRefreshedAt: dayjs.Dayjs;

  // Return all users
  allUsers(): User[] {
    return this.channels.flatMap((channel) => channel.users);
  }

  // Get amount of users
  get userAmount(): number {
    return this.allUsers().length;
  }

  // Refresh Users map
  async refreshUsers(): Promise<CacheResponse> {
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

    // Actual refresh
    try {
      // Get all users from database
      const databaseUsers = await this.database.findAllUsers();

      // Modify users with data from LeetCode
      for (let i = 0; i < databaseUsers.length; i++) {
        const databaseUser = databaseUsers[i];

        // Get username from Database User
        const { username } = databaseUser;

        // Get data from LeetCode related to this User
        const userData = await this.getLeetcodeDataFromUsername(username);

        // If UserData was returned from Backend, replace User in cache
        if (userData.exists) {
          this.addOrReplaceUserInCache(username, userData);
          log(SM.USERNAME_WAS_REFRESHED(username));
        } else {
          log(SM.USERNAME_WAS_NOT_REFRESHED(username));
        }

        // Wait X seconds until loading next User, X is set in .env
        await this.delay(this.delayTime);
      }

      // Sort objects after refresh
      this.sortUsers();
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

  // Add User by Username
  async addUser(username: string): Promise<CacheResponse> {
    // If user count is gte user amount limit, stop execution
    if (this.userAmount >= this.userLimit) {
      return {
        status: constants.STATUS.ERROR,
        detail: BM.USERNAME_NOT_ADDED_USER_LIMIT(username, this.userLimit),
      };
    }

    // Add User to Database
    const usernameLower = username.toLowerCase();
    const user = await this.database.addUser(usernameLower);

    if (user) {
      // Load data from LeetCode by Username
      const userData = await this.getLeetcodeDataFromUsername(username);

      if (userData.exists) {
        this.users.push(userData);

        // Sort objects after adding
        this.sortUsers();

        return {
          status: constants.STATUS.SUCCESS,
          detail: BM.USERNAME_WAS_ADDED(
            username, this.userAmount, this.userLimit,
          ),
        };
      }

      // If user does not exist in LeetCode, remove User
      await this.database.removeUser(usernameLower);

      return {
        status: constants.STATUS.ERROR,
        detail: BM.USERNAME_NOT_FOUND_ON_LEETCODE(username),
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: BM.USERNAME_ALREADY_EXISTS(username),
    };
  }

  // Remove User by Username
  async removeUser(username: string): Promise<CacheResponse> {
    const usernameLower = username.toLowerCase();
    const deleted = await this.database.removeUser(usernameLower);

    if (deleted) {
      // Set objects array to tempObjects
      this.users = this.users.filter((user) => (
        user.username.toLowerCase() !== username
      ));

      // Sort objects after removing
      this.sortUsers();

      return {
        status: constants.STATUS.SUCCESS,
        detail: BM.USERNAME_WAS_DELETED(username),
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: BM.USERNAME_NOT_FOUND(username),
    };
  }

  // Load User by Username
  loadUser(username: string): User {
    return this.allUsers().find((user) => (
      user.username.toLowerCase() === username.toLowerCase()
    ));
  }
}

export default new Cache();
