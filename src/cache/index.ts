/* eslint-disable no-await-in-loop */
import * as dayjs from 'dayjs';

import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { log, delay } from '../utils/helper';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import { User } from '../leetcode/models';

import { CacheResponse } from './response.model';

const { DATE_FORMAT } = constants.SYSTEM;
const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

class Cache {
  users: User[] = [];

  database = Database;

  userLimit: number = constants.SYSTEM.USER_AMOUNT_LIMIT;

  getLeetcodeDataFromUsername: CallableFunction = getLeetcodeDataFromUsername;

  delayTime: number = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  delay = delay;

  // Return all users
  allUsers(): User[] {
    return this.users;
  }

  // Get amount of users
  get userAmount(): number {
    return this.allUsers().length;
  }

  // Replace User with username in the cache
  addOrReplaceUserInCache(username: string, userData: User): void {
    for (let i = 0; i < this.userAmount; i++) {
      if (this.users[i].username.toLowerCase() === username.toLowerCase()) {
        this.users[i] = userData;
        return;
      }
    }

    // If user was not found in cache, add user
    this.users.push(userData);
  }

  // Refresh Users map
  async refreshUsers(): Promise<CacheResponse> {
    // If database was already refreshing
    if (this.database.isRefreshing) {
      log(SM.IS_ALREADY_REFRESHING);
      return {
        status: constants.STATUS.ERROR,
        detail: BM.IS_ALREADY_REFRESHING,
      };
    }

    // Set database as refreshing and get refresh time
    this.database.isRefreshing = true;
    const refreshedStartedAt: string = dayjs().format(DATE_FORMAT);

    // Log when refresh started
    log(SM.DATABASE_STARTED_REFRESH(refreshedStartedAt));

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

    // Set database indicators
    this.database.isRefreshing = false;
    const refreshFinishedAt = dayjs().format(DATE_FORMAT);

    // Log when refresh started
    log(SM.DATABASE_FINISHED_REFRESH(refreshFinishedAt));

    return {
      status: constants.STATUS.SUCCESS,
      detail: BM.IS_REFRESHED,
    };
  }

  // Sort all Users by amount of solved questions on LeetCode
  sortUsers(): void {
    this.users.sort(
      (user1, user2) => {
        const solved1 = user1.solved !== undefined ? user1.solved : -Infinity;
        const solved2 = user2.solved !== undefined ? user2.solved : -Infinity;
        return solved2 - solved1;
      },
    );
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

  // Remove all Users from Database
  async clearUsers() {
    const deleted = await this.database.removeAllUsers();

    if (deleted) {
      // Remove all Users from cache
      this.users = [];

      return {
        status: constants.STATUS.SUCCESS,
        detail: BM.DATABASE_WAS_CLEARED,
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: BM.DATABASE_WAS_NOT_CLEARED,
    };
  }

  // Load User by Username
  loadUser(username: string): User {
    return this.users.find((user) => (
      user.username.toLowerCase() === username.toLowerCase()
    ));
  }
}

export default new Cache();
