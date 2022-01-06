/* eslint-disable dot-notation */
/* eslint-disable no-console */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import * as mongoose from 'mongoose';

import dictionary from '../../utils/dictionary';
import MongoDB from '../../database/mongo';

const { SERVER_MESSAGES: SM } = dictionary;

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

test('database.mongo.loadUser method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  const loadedUser1 = await mongoDB.loadUser('username1');
  expect(loadedUser1['username']).toBe('username1');

  const loadedUser2 = await mongoDB.loadUser('username2');
  expect(loadedUser2['username']).toBe('username2');

  const notFoundUser = await mongoDB.loadUser('not_found_username');
  expect(notFoundUser).toBeNull();
});

test('database.mongo.removeUser method', async () => {
  // Connect
  await mongoDB.connect();

  // Add users
  await mongoDB.addUser('username1');
  await mongoDB.addUser('username2');

  // Remove User
  const loadedUser1 = await mongoDB.loadUser('username1');
  expect(loadedUser1['username']).toBe('username1');

  const result1 = await mongoDB.removeUser('username1');
  expect(result1).toBeTruthy();

  const removedUser = await mongoDB.loadUser('username1');
  expect(removedUser).toBeNull();

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
