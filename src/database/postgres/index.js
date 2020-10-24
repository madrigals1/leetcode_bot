const { Client } = require('pg');

const { error } = require('../../utils/helper');
const {
  POSTGRES_DB_URL,
  POSTGRES_DB_NAME,
  POSTGRES_DB_USER,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
} = require('../../utils/constants');

const { QUERIES } = require('./queries');

class Postgres {
  constructor() {
    this.client = new Client({
      user: POSTGRES_DB_USER,
      host: POSTGRES_DB_URL,
      database: POSTGRES_DB_NAME,
      password: POSTGRES_DB_PASSWORD,
      port: POSTGRES_DB_PORT,
    });
  }

  // Connect database
  async connect() {
    this.client.connect();

    // Query for creating users table
    const query = QUERIES.CREATE_USERS_TABLE;

    // Create table for users if not exist
    return this.client.query(query)
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Find all Users
  async findAllUsers() {
    return this.client.query(QUERIES.GET_ALL_USERS)
      .then((res) => res.rows)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Load User by `username`
  async loadUser(username) {
    return this.client.query(QUERIES.LOAD_USER(username))
      .then((res) => res.rows[0])
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Add User to Database
  async addUser(username) {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.client.query(QUERIES.ADD_USER(username))
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Remove User from Database
  async removeUser(username) {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.client.query(QUERIES.REMOVE_USER(username))
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Remove all Users from Database
  async removeAllUsers() {
    return this.client.query(QUERIES.REMOVE_ALL_USERS)
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }
}

module.exports = Postgres;
