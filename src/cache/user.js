import moment from 'moment';

import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { log, delay } from '../utils/helper';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';

class User {
  constructor() {
    // Create cache container for all Users
    this.users = [];
  }

  // Return all users
  all() {
    return this.users;
  }

  // Get amount of users
  get amount() {
    return this.all().length;
  }

  // Replace User with username in the cache
  addOrReplaceUser(username, userData) {
    for (let i = 0; i < this.amount; i++) {
      if (this.users[i].username === username) {
        this.users[i] = userData;
        return;
      }
    }

    // If user was not found in cache, add user
    this.users.push(userData);
  }

  // Refresh Users map
  async refresh() {
    // If database was already refreshing
    if (Database.isRefreshing) {
      log(dictionary.SERVER_MESSAGES.IS_ALREADY_REFRESHING);
      return dictionary.BOT_MESSAGES.IS_ALREADY_REFRESHING;
    }

    // Set database as refreshing and get refresh time
    Database.isRefreshing = true;
    const refreshedStartedAt = moment().format(constants.DATE_FORMAT);

    // Log when refresh started
    log(dictionary.SERVER_MESSAGES.DATABASE_STARTED_REFRESH(
      refreshedStartedAt,
    ));

    // Get all users from database
    const databaseUsers = await Database.findAllUsers();

    // Modify users with data from LeetCode
    for (let i = 0; i < databaseUsers.length; i++) {
      const databaseUser = databaseUsers[i];

      // Get username from Database User
      const { username } = databaseUser;

      // Get data from LeetCode related to this User
      // eslint-disable-next-line no-await-in-loop
      const userData = await getLeetcodeDataFromUsername(username);

      // If UserData was returned from Backend, replace User in cache
      if (userData) {
        this.addOrReplaceUser(username, userData);
        log(dictionary.SERVER_MESSAGES.USERNAME_WAS_REFRESHED(username));
      } else {
        log(dictionary.SERVER_MESSAGES.USERNAME_WAS_NOT_REFRESHED(username));
      }

      // Wait X seconds until loading next User, X is set in .env
      // eslint-disable-next-line no-await-in-loop
      await delay(constants.DELAY_TIME_MS);
    }

    // Sort objects after refresh
    await this.sort();

    // Set database indicators
    Database.isRefreshing = false;
    const refreshFinishedAt = moment().format(constants.DATE_FORMAT);

    // Log when refresh started
    log(dictionary.SERVER_MESSAGES.DATABASE_FINISHED_REFRESH(
      refreshFinishedAt,
    ));
    return dictionary.BOT_MESSAGES.IS_REFRESHED;
  }

  // Sort all Users by amount of solved questions on LeetCode
  async sort() {
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
  async add(username) {
    // If user count is gte user amount limit, stop execution
    if (this.amount >= constants.USER_AMOUNT_LIMIT) {
      return {
        status: constants.STATUS.ERROR,
        detail: dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(username),
      };
    }

    // Add User to Database
    const user = await Database.addUser(username);

    if (user) {
      // Load data from LeetCode by Username
      const userData = await getLeetcodeDataFromUsername(username);

      if (userData) {
        this.users.push(userData);

        // Sort objects after adding
        await this.sort();

        return {
          status: constants.STATUS.SUCCESS,
          detail: dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
            username, this.amount,
          ),
        };
      }

      // If user does not exist in LeetCode, remove User
      await Database.removeUser(username);

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
  async remove(username) {
    const deleted = await Database.removeUser(username);

    if (deleted) {
      // Set objects array to tempObjects
      this.users = this.users.filter((user) => (
        user.username.toLowerCase() !== username
      ));

      // Sort objects after removing
      await this.sort();

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
  async clear() {
    const deleted = await Database.removeAllUsers();

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
  load(username) {
    return this.users.find((user) => (
      user.username.toLowerCase() === username
    ));
  }
}

export default new User();
