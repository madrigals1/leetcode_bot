import moment from 'moment';

import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { log, delay } from '../utils/helper';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';

class Cache {
  constructor() {
    // Create cache container for all Users
    this.users = [];
    this.database = Database;
    this.userLimit = constants.USER_AMOUNT_LIMIT;
    this.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
    this.delayTime = constants.DELAY_TIME_MS;
  }

  // Return all users
  allUsers() {
    return this.users;
  }

  // Get amount of users
  get userAmount() {
    return this.allUsers().length;
  }

  // Replace User with username in the cache
  addOrReplaceUserInCache(username, userData) {
    for (let i = 0; i < this.userAmount; i++) {
      if (this.users[i].username === username) {
        this.users[i] = userData;
        return;
      }
    }

    // If user was not found in cache, add user
    this.users.push(userData);
  }

  // Refresh Users map
  async refreshUsers() {
    // If database was already refreshing
    if (this.database.isRefreshing) {
      log(dictionary.SERVER_MESSAGES.IS_ALREADY_REFRESHING);
      return dictionary.BOT_MESSAGES.IS_ALREADY_REFRESHING;
    }

    // Set database as refreshing and get refresh time
    this.database.isRefreshing = true;
    const refreshedStartedAt = moment().format(constants.DATE_FORMAT);

    // Log when refresh started
    log(dictionary.SERVER_MESSAGES.DATABASE_STARTED_REFRESH(
      refreshedStartedAt,
    ));

    // Get all users from database
    const databaseUsers = await this.database.findAllUsers();

    // Modify users with data from LeetCode
    for (let i = 0; i < databaseUsers.length; i++) {
      const databaseUser = databaseUsers[i];

      // Get username from Database User
      const { username } = databaseUser;

      // Get data from LeetCode related to this User
      // eslint-disable-next-line no-await-in-loop
      const userData = await this.getLeetcodeDataFromUsername(username);

      // If UserData was returned from Backend, replace User in cache
      if (userData) {
        this.addOrReplaceUserInCache(username, userData);
        log(dictionary.SERVER_MESSAGES.USERNAME_WAS_REFRESHED(username));
      } else {
        log(dictionary.SERVER_MESSAGES.USERNAME_WAS_NOT_REFRESHED(username));
      }

      // Wait X seconds until loading next User, X is set in .env
      // eslint-disable-next-line no-await-in-loop
      await delay(this.delayTime);
    }

    // Sort objects after refresh
    await this.sortUsers();

    // Set database indicators
    this.database.isRefreshing = false;
    const refreshFinishedAt = moment().format(constants.DATE_FORMAT);

    // Log when refresh started
    log(dictionary.SERVER_MESSAGES.DATABASE_FINISHED_REFRESH(
      refreshFinishedAt,
    ));
    return dictionary.BOT_MESSAGES.IS_REFRESHED;
  }

  // Sort all Users by amount of solved questions on LeetCode
  async sortUsers() {
    this.users.sort(
      (user1, user2) => {
        const solved1 = user1.solved !== undefined
          ? parseInt(user1.solved, 10)
          : -Math.Infinity;
        const solved2 = user2.solved !== undefined
          ? parseInt(user2.solved, 10)
          : -Math.Infinity;
        return solved2 - solved1;
      },
    );
  }

  // Add User by Username
  async addUser(username) {
    // If user count is gte user amount limit, stop execution
    if (this.userAmount >= this.userLimit) {
      return {
        status: constants.STATUS.ERROR,
        detail: dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(
          username, this.userLimit,
        ),
      };
    }

    // Add User to Database
    const user = await this.database.addUser(username);

    if (user) {
      // Load data from LeetCode by Username
      const userData = await this.getLeetcodeDataFromUsername(username);

      if (userData) {
        this.users.push(userData);

        // Sort objects after adding
        await this.sortUsers();

        return {
          status: constants.STATUS.SUCCESS,
          detail: dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
            username, this.userAmount, this.userLimit,
          ),
        };
      }

      // If user does not exist in LeetCode, remove User
      await this.database.removeUser(username);

      return {
        status: constants.STATUS.ERROR,
        detail: dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND_ON_LEETCODE(
          username,
        ),
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: dictionary.BOT_MESSAGES.USERNAME_ALREADY_EXISTS(username),
    };
  }

  // Remove User by Username
  async removeUser(username) {
    const deleted = await this.database.removeUser(username);

    if (deleted) {
      // Set objects array to tempObjects
      this.users = this.users.filter((user) => (
        user.username.toLowerCase() !== username
      ));

      // Sort objects after removing
      await this.sortUsers();

      return {
        status: constants.STATUS.SUCCESS,
        detail: dictionary.BOT_MESSAGES.USERNAME_WAS_DELETED(username),
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username),
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
        detail: dictionary.BOT_MESSAGES.DATABASE_WAS_CLEARED,
      };
    }

    return {
      status: constants.STATUS.ERROR,
      detail: dictionary.BOT_MESSAGES.DATABASE_WAS_NOT_CLEARED,
    };
  }

  // Load User by Username
  loadUser(username) {
    return this.users.find((user) => (
      user.username.toLowerCase() === username
    )) || false;
  }
}

export default new Cache();
