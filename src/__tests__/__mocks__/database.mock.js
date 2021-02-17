import users from './data.mock';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class MockDatabaseProvider {
  constructor() {
    this.isRefreshing = false;
    this.savedUsers = users.map((user) => ({ username: user.username }));
    this.fakeResult = true;
    this.users = [];
  }

  // Connect to Database
  async connect() {
    return new Promise((resolve) => resolve(true));
  }

  // Create Users table if not exists
  createUserTable() {
    return this.fakeResult;
  }

  // Find all Users
  async findAllUsers() {
    return this.savedUsers;
  }

  // Load User by `username`
  async loadUser(username) {
    return this.fakeResult;
  }

  // Add User to Database
  async addUser(username) {
    if (this.users.includes(username)) {
      return false;
    }
    this.users.push(username);
    return true;
  }

  // Remove User from Database
  async removeUser(username) {
    if (!this.users.includes(username)) {
      return false;
    }
    this.users = this.users.filter((uname) => uname !== username);
    return true;
  }

  // Remove all Users from Database
  async removeAllUsers() {
    this.users = [];
    return true;
  }
}

export default MockDatabaseProvider;
