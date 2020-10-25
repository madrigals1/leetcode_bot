const moment = require('moment');

const Database = require('../database');
const { getLeetcodeDataFromUsername } = require('../leetcode');
const { log, delay } = require('../utils/helper');
const { DATE_FORMAT, DELAY_TIME_MS, STATUS } = require('../utils/constants');
const { BOT_MESSAGES, SERVER_MESSAGES } = require('../utils/dictionary');

class User {
  constructor() {
    // Create cache container for all Users
    this.users = [];
  }

  // Return all users
  all() {
    return this.users;
  }

  // Replace User with username in the cache
  addOrReplaceUser(username, userData) {
    for (let i = 0; i < this.users.length; i++) {
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
    if (!Database.isRefreshing) {
      // Set database as refreshing and get refresh time
      Database.isRefreshing = true;
      const refreshedStartedAt = moment().format(DATE_FORMAT);

      // Log when refresh started
      log(SERVER_MESSAGES.DATABASE_STARTED_REFRESH(refreshedStartedAt));

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
          log(SERVER_MESSAGES.USERNAME_WAS_REFRESHED(username));
        } else {
          log(SERVER_MESSAGES.USERNAME_WAS_NOT_REFRESHED(username));
        }

        // Wait X seconds until loading next User, X is set in .env
        // eslint-disable-next-line no-await-in-loop
        await delay(DELAY_TIME_MS);
      }

      // Sort objects after refresh
      await this.sort();

      // Set database indicators
      Database.isRefreshing = false;
      const refreshFinishedAt = moment().format(DATE_FORMAT);

      // Log when refresh started
      log(SERVER_MESSAGES.DATABASE_FINISHED_REFRESH(refreshFinishedAt));
    } else {
      log(SERVER_MESSAGES.IS_ALREADY_REFRESHING);
    }
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
          status: STATUS.SUCCESS,
          detail: BOT_MESSAGES.USERNAME_WAS_ADDED(username),
        };
      }

      // If user does not exist in LeetCode, remove User
      await Database.removeUser(username);

      return {
        status: STATUS.ERROR,
        detail: BOT_MESSAGES.USERNAME_NOT_FOUND_ON_LEETCODE(username),
      };
    }

    return {
      status: STATUS.ERROR,
      detail: BOT_MESSAGES.USERNAME_ALREADY_EXISTS(username),
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
        status: STATUS.SUCCESS,
        detail: BOT_MESSAGES.USERNAME_WAS_DELETED(username),
      };
    }

    return {
      status: STATUS.ERROR,
      detail: BOT_MESSAGES.USERNAME_NOT_FOUND(username),
    };
  }

  // Remove all Users from Database
  async clear() {
    const deleted = await Database.removeAllUsers();

    if (deleted) {
      // Remove all Users from cache
      this.users = [];

      return {
        status: STATUS.SUCCESS,
        detail: BOT_MESSAGES.DATABASE_WAS_CLEARED,
      };
    }

    return {
      status: STATUS.ERROR,
      detail: BOT_MESSAGES.DATABASE_WAS_NOT_CLEARED,
    };
  }

  // Load User by Username
  load(username) {
    return this.users.find((user) => (
      user.username.toLowerCase() === username
    ));
  }
}

module.exports = new User();
