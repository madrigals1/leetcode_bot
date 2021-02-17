import users from './data.mock';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class MockDatabaseProvider {
  constructor() {
    this.isRefreshing = false;
    this.savedUsers = users.map((user) => ({ username: user.username }));
  }

  // Connect to Database
  async connect() {
    return new Promise((resolve) => resolve(true));
  }

  // Create Users table if not exists
  createUserTable() {
    return true;
  }

  // Find all Users
  async findAllUsers() {
    return this.savedUsers;
  }

  // Load User by `username`
  async loadUser(username) {
    return true;
  }

  // Add User to Database
  async addUser(username) {
    return true;
  }

  // Remove User from Database
  async removeUser(username) {
    return true;
  }

  // Remove all Users from Database
  async removeAllUsers() {
    return true;
  }
}

export default MockDatabaseProvider;
