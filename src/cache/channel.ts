import getLeetcodeDataFromUsername from '../leetcode';
import { User } from '../leetcode/models';
import dictionary from '../utils/dictionary';
import { log } from '../utils/helper';

type callbackType = (username: string) => Promise<User>;

const { SERVER_MESSAGES: SM } = dictionary;

export class Channel {
  users: User[] = [];

  getLeetcodeDataFromUsername: callbackType = getLeetcodeDataFromUsername;

  // Get amount of users
  get userAmount(): number {
    return this.users.length;
  }

  // Replace User
  addOrReplaceUser(username: string, user: User): void {
    // Replace User if username was found
    for (let i = 0; i < this.userAmount; i++) {
      if (this.users[i].username.toLowerCase() === username.toLowerCase()) {
        this.users[i] = user;
        return;
      }
    }

    // If user was not found in cache, add user
    this.users.push(user);
  }

  refresh(): void {
    this.users.forEach(async (user) => {
      // Load LeetCode data from username
      const leetcodeUser = await getLeetcodeDataFromUsername(user.username);

      if (leetcodeUser.exists) {
        this.addOrReplaceUser(user.username, leetcodeUser);
        log(SM.USERNAME_WAS_REFRESHED(user.username));
      } else {
        log(SM.USERNAME_WAS_NOT_REFRESHED(user.username));
      }
    });

    // We should sort Users after every refresh
    this.sortUsers();
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
}
