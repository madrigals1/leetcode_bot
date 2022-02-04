import * as _ from 'lodash';

import { User } from '../leetcode/models';
import Database from '../database';
import { log } from '../utils/helper';

export class Channel {
  users: User[] = [];

  database = Database;

  channelId: string;

  userLimit: number;

  /**
   * Create a new instance of the Channel class
   * @param {string} channelId - The channel ID of the Channel.
   */
  constructor(channelId: string, userLimit: number) {
    this.channelId = channelId;
    this.userLimit = userLimit;
  }

  /**
   * Get the number of users in the Channel.
   * @returns The number of users in the Channel.
   */
  get userAmount(): number {
    return this.users.length;
  }

  /**
   * Add a User to the Channel
   * @param {User} user - User
   */
  async addUser(user: User): Promise<boolean> {
    // Add User to Channel in Database
    return this.database
      .addUserToChannel(this.channelId, user.username)
      .then((addedToDB) => {
        if (addedToDB) {
          // Add User to Cache
          this.users.push(user);

          // Sort Users after adding new one
          this.sortUsers();
        }

        return addedToDB;
      })
      .catch((err) => {
        log(err);
        return false;
      });
  }

  /**
   * Remove a user from the Channel
   * @param {string} username - The username of the User to remove.
   */
  async removeUser(username: string): Promise<boolean> {
    // Remove User from Channel in Database
    return this.database
      .removeUserFromChannel(this.channelId, username)
      .then((deletedFromDB) => {
        // Remove User from Cache
        if (deletedFromDB) _.remove(this.users, { username });
        return deletedFromDB;
      })
      .catch((err) => {
        log(err);
        return false;
      });
  }

  /**
   * Return the User with the given username
   * @param {string} username - string
   * @returns The User object that matches the username.
   */
  getUser(username: string): User {
    return this.users.find((user) => user.username === username);
  }

  /**
   * Sort the Users by the number of solved problems
   */
  sortUsers(): void {
    this.users.sort(
      (user1, user2) => {
        const solved1 = user1.solved !== undefined ? user1.solved : -Infinity;
        const solved2 = user2.solved !== undefined ? user2.solved : -Infinity;
        return solved2 - solved1;
      },
    );
  }

  /**
   * Clear the Channel from all Users
   */
  clear(): void {
    this.database.clearChannel(this.channelId);
  }
}
