import _ from 'lodash';

import Cache from '../src/cache';

import getLeetcodeDataFromUsername from './__mocks__/utils';
import MockDatabaseProvider from './__mocks__/database';
import users from './__mocks__/data';

Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
Cache.delayTime = 0;

beforeEach(async () => {
  await Cache.clearUsers();
});

afterEach(async () => {
  await Cache.clearUsers();
});

test('Cache.all method', () => {
  // Expect default Cache.users to be array
  expect(Array.isArray(Cache.users)).toBe(true);
  expect(Array.isArray(Cache.all())).toBe(true);
});

test('Cache.amount method', async () => {
  expect(Cache.amount).toBe(0);
  await Cache.addUser('random_username');
  expect(Cache.amount).toBe(1);
  await Cache.addUser('random_username_2');
  expect(Cache.amount).toBe(2);
  await Cache.clearUsers();
  expect(Cache.amount).toBe(0);
});

test('Cache.addOrReplaceUserInCache method', async () => {
  await Cache.addUser('random_username');

  const firstUserData = Cache.users[0];

  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.avatar).toBe('https://example.com/random_link');
  expect(firstUserData.submissions.length).toBe(2);

  const secondUserDataBefore = (
    await getLeetcodeDataFromUsername('random_username_2')
  );

  await Cache.addOrReplaceUserInCache('random_username', secondUserDataBefore);

  const secondUserData = Cache.users[0];

  expect(JSON.stringify(secondUserDataBefore))
    .toBe(JSON.stringify(secondUserData));

  expect(Cache.amount).toBe(1);
});

test('Cache.refreshUsers method', async () => {
  // Save original array
  const usersClone = [...users];

  // Adding in this order, because they will be sorted by solved count
  await Cache.addUser('random_username_2');
  await Cache.addUser('random_username');

  users[0].name = 'New Name 1';
  users[1].name = 'New Name 2';

  await Cache.refreshUsers();

  expect(Cache.users[0].name).toBe('New Name 2');
  expect(Cache.users[1].name).toBe('New Name 1');

  // Clear array and bring back original array
  users.length = 0;
  usersClone.forEach((user) => users.push(user));
});

test('Cache.sortUsers method', async () => {
  const unsortedUsers = [
    {
      username: 'user_1',
      solved: 123,
    },
    {
      username: 'user_2',
      solved: 0,
    },
    {
      username: 'user_3',
      solved: 23,
    },
    {
      username: 'user_4',
      solved: 1452,
    },
    {
      username: 'user_5',
      solved: 700,
    },
    {
      username: 'user_6',
      solved: 0,
    },
  ];

  const sortedUsers = [
    {
      username: 'user_4',
      solved: 1452,
    },
    {
      username: 'user_5',
      solved: 700,
    },
    {
      username: 'user_1',
      solved: 123,
    },
    {
      username: 'user_3',
      solved: 23,
    },
    {
      username: 'user_2',
      solved: 0,
    },
    {
      username: 'user_6',
      solved: 0,
    },
  ];

  unsortedUsers.forEach((user) => Cache.users.push(user));

  await Cache.sortUsers();

  expect(_.isEqual(Cache.users, sortedUsers)).toBe(true);
});
