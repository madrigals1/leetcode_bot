import * as _ from 'lodash';

import getLeetcodeDataFromUsername from '../leetcode';
import { User } from '../leetcode/models';
import Database from '../database';

export class Channel {
  users: User[] = [];

  database = Database;

  getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;

  channelId: string;

  /**
   * Create a new instance of the Channel class
   * @param {string} channelId - The channel ID of the Channel.
   */
  constructor(channelId: string) {
    this.channelId = channelId;
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
  addUser(user: User): void {
    // Add User to Channel in Database
    this.database.addUserToChannel(this.channelId, user.username);

    // Add User to Cache
    this.users.push(user);

    // Sort Users after adding new one
    this.sortUsers();
  }

  /**
   * Remove a user from the Channel
   * @param {string} username - The username of the User to remove.
   */
  removeUser(username: string): void {
    // Remove User from Channel in Database
    this.database.removeUserFromChannel(this.channelId, username);

    // Remove User from Cache
    _.remove(this.users, { username });
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
