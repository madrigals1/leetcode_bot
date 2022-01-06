import pg from 'pg';

import { error, log } from '../../utils/helper';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import DatabaseProvider from '../database.proto';

import QUERIES from './queries';

const { POSTGRES } = constants.DATABASE;
const { SERVER_MESSAGES: SM } = dictionary;

class Postgres extends DatabaseProvider {
  client = new pg.Client({
    user: POSTGRES.USER,
    host: POSTGRES.URL,
    database: POSTGRES.NAME,
    password: POSTGRES.PASSWORD,
    port: POSTGRES.PORT,
  });

  // Connect database
  async connect(): Promise<boolean> {
    this.client.connect();

    // Query for creating users table
    const query = QUERIES.CREATE_USERS_TABLE;

    // Create table for users if not exist
    return this.client.query(query)
      .then(() => {
        log(SM.CONNECTION_STATUS.SUCCESSFUL);
        return true;
      })
      .catch((err) => {
        error(SM.CONNECTION_STATUS.ERROR(err));
        this.client.end();
        return false;
      });
  }

  // Find all Users
  async findAllUsers(): Promise<unknown> {
    return this.client.query(QUERIES.GET_ALL_USERS)
      .then((res) => res.rows)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Load User by `username`
  async loadUser(username: string): Promise<unknown> {
    return this.client.query(QUERIES.LOAD_USER(username))
      .then((res) => res.rows[0])
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Add User to Database
  async addUser(username: string): Promise<unknown> {
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
  async removeUser(username: string): Promise<boolean> {
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
  async removeAllUsers(): Promise<boolean> {
    return this.client.query(QUERIES.REMOVE_ALL_USERS)
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }
}

export default Postgres;
