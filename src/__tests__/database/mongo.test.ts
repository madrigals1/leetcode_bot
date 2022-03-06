/* eslint-disable dot-notation */
/* eslint-disable no-console */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import * as mongoose from 'mongoose';

import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import MongoDB from '../../database/mongo';

let mongoMemoryServer: MongoMemoryServer;
let mongoDB: MongoDB;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer
    .create({ binary: { version: '4.2.18' } });
});

afterAll(() => {
  mongoose.connection.close();
});

beforeEach(() => {
  mongoDB = new MongoDB();
  mongoDB.mongoUrl = mongoMemoryServer.getUri();
});

afterAll(async () => {
  await mongoMemoryServer.stop();
  jest.setTimeout(5000);
});

test('database.mongo.connect method', async () => {
  // Connect correctly
  await mongoDB.connect();
  expect(console.log).toHaveBeenCalledWith(SM.CONNECTION_STATUS.SUCCESSFUL);

  // Fail on connecting incorrect URL
  mongoDB.mongoUrl = 'fake_url';
  await mongoDB.connect();
  const errorMessage = SM.CONNECTION_STATUS.ERROR('');
  expect(console.error)
    .toHaveBeenCalledWith(expect.stringContaining(errorMessage));
});

test('database.mongo.addUser method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  const foundUsers = await mongoDB.UserModel.find();
  expect(foundUsers.length).toBe(2);
  foundUsers.forEach((foundUser) => {
    expect(['username1', 'username2']).toContain(foundUser['username']);
  });
});

test('database.mongo.findAllUsers method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  const foundUsers = await mongoDB.findAllUsers();
  expect(foundUsers.length).toBe(2);
  foundUsers.forEach((foundUser) => {
    expect(['username1', 'username2']).toContain(foundUser['username']);
  });
});

test('database.mongo - userExists method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  const user1exists = await mongoDB.userExists('username1');
  expect(user1exists).toBe(true);

  const user2exists = await mongoDB.userExists('username2');
  expect(user2exists).toBe(true);

  const userDoesNotExist = await mongoDB.userExists('not_found_username');
  expect(userDoesNotExist).toBe(false);
});

test('database.mongo.removeUser method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  // Remove User
  const user1exists = await mongoDB.userExists('username1');
  expect(user1exists).toBe(true);

  const result1 = await mongoDB.removeUser('username1');
  expect(result1).toBeTruthy();

  const userDoesNotExist = await mongoDB.userExists('username1');
  expect(userDoesNotExist).toBe(false);

  // Remove not existing user
  const result2 = await mongoDB.removeUser('not_found_username');
  expect(result2).toBeFalsy();
});

test('database.mongo.removeAllUsers method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  const foundUsers = await mongoDB.findAllUsers();
  expect(foundUsers.length).toBe(2);

  await mongoDB.removeAllUsers();

  const notFoundUsers = await mongoDB.findAllUsers();
  expect(notFoundUsers.length).toBe(0);
});
