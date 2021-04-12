import { User } from '../../leetcode/models';

import users from './data.mock';

const mockUser1: User = users[0];

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class MockDatabaseProvider {
  isRefreshing = false;

  savedUsers: User[] = (
    users.map((user) => ({ ...mockUser1, username: user.username }))
  );

  fakeResult = true;

  users: string[] = [];

  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }

  // Create Users table if not exists
  createUserTable(): boolean {
    return this.fakeResult;
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return this.savedUsers;
  }

  // Load User by `username`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async loadUser(username: string): Promise<boolean> {
    return this.fakeResult;
  }

  // Add User to Database
  async addUser(username: string): Promise<boolean> {
    if (this.users.includes(username)) {
      return false;
    }
    this.users.push(username);
    return true;
  }

  // Remove User from Database
  async removeUser(username: string): Promise<boolean> {
    if (!this.users.includes(username)) {
      return false;
    }
    this.users = this.users.filter((uname) => uname !== username);
    return true;
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<boolean> {
    this.users = [];
    return this.fakeResult;
  }
}

export default MockDatabaseProvider;
