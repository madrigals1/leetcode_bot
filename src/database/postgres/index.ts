import pg from 'pg';

import { error, log } from '../../utils/helper';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import DatabaseProvider from '../database.proto';
import { Subscription } from '../../leetcode/models';

import QUERIES from './queries';

const { POSTGRES } = constants.DATABASE;

class Postgres extends DatabaseProvider {
  client = new pg.Client({
    user: POSTGRES.USER,
    host: POSTGRES.URL,
    database: POSTGRES.NAME,
    password: POSTGRES.PASSWORD,
    port: POSTGRES.PORT,
  });

  // Connect database
  async connect(): Promise<void> {
    this.client.connect();

    // Queries for creating Users and Subscriptions table
    const usersQuery = QUERIES.CREATE_USERS_TABLE;
    const subscriptionsQuery = QUERIES.CREATE_SUBSCRIPTIONS_TABLE;

    this.client.query(usersQuery)
      .catch((err) => {
        error(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
        this.client.end();
        return null;
      });

    this.client.query(subscriptionsQuery)
      .catch((err) => {
        error(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
        this.client.end();
        return null;
      });

    log(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
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
  async loadUser(username: string) {
    return this.client.query(QUERIES.LOAD_USER(username))
      .then((res) => res.rows[0])
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Add User to Database
  async addUser(username: string) {
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
  async removeUser(username: string) {
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

  async getSubscription(chatId: string): Promise<Subscription> {
    return this.client.query(QUERIES.LOAD_SUBSCRIPTION(chatId))
      .then((res) => ({
        chatId: res.rows[0],
        provider: res.rows[1],
      }))
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  async upsertSubscription(subscription: Subscription): Promise<boolean> {
    const foundSubscription = this.getSubscription(subscription.chatId);
    let res = false;

    if (foundSubscription) {
      this.client.query(QUERIES.UPDATE_SUBSCRIPTION(subscription))
        .then(() => { res = true; })
        .catch((err) => {
          error(err);
          this.client.end();
        });
    } else {
      this.client.query(QUERIES.ADD_SUBSCRIPTION(subscription))
        .then(() => { res = true; })
        .catch((err) => {
          error(err);
          this.client.end();
        });
    }

    return res;
  }

  async removeSubscription(chatId: string): Promise<boolean> {
    return this.client.query(QUERIES.REMOVE_SUBSCRIPTION(chatId))
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.client.query(QUERIES.GET_ALL_SUBSCRIPTIONS)
      .then((rows) => rows.map((row) => ({
        chatId: row[0],
        provider: row[1],
      })))
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }
}

export default Postgres;
