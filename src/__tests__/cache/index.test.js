import _ from 'lodash';

import Cache from '../../cache';
import getLeetcodeDataFromUsername from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import users from '../__mocks__/data.mock';
import dictionary from '../../utils/dictionary';
import constants from '../../utils/constants';

Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
Cache.delayTime = 0;

beforeEach(async () => {
  await Cache.clearUsers();
});

afterEach(async () => {
  Cache.users.length = 0;
});

test('cache.index.Cache.allUsers method', () => {
  // Expect default Cache.users to be array
  expect(Array.isArray(Cache.users)).toBe(true);
  expect(Array.isArray(Cache.allUsers())).toBe(true);
});

test('cache.index.Cache.userAmount property', async () => {
  expect(Cache.userAmount).toBe(0);
  await Cache.addUser('random_username');
  expect(Cache.userAmount).toBe(1);
  await Cache.addUser('random_username_2');
  expect(Cache.userAmount).toBe(2);
  await Cache.clearUsers();
  expect(Cache.userAmount).toBe(0);
});

test('cache.index.Cache.addOrReplaceUserInCache method', async () => {
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

  expect(Cache.userAmount).toBe(1);

  const firstUserReaddedBefore = (
    await getLeetcodeDataFromUsername('random_username')
  );

  await Cache.addOrReplaceUserInCache(
    'unexisting_username', firstUserReaddedBefore,
  );

  const firstUserReaddedAfter = Cache.users[1];

  expect(JSON.stringify(firstUserReaddedBefore))
    .toBe(JSON.stringify(firstUserReaddedAfter));

  expect(Cache.userAmount).toBe(2);
});

test('cache.index.Cache.refreshUsers method', async () => {
  // Save original array
  const usersClone = _.cloneDeep(users, true);

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

  // Check refreshing case
  Cache.database.isRefreshing = true;
  const result = await Cache.refreshUsers();

  expect(result).toBe(dictionary.BOT_MESSAGES.IS_ALREADY_REFRESHING);
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.IS_ALREADY_REFRESHING,
  );
  Cache.database.isRefreshing = false;

  // Check case, where User is deleted from LeetCode
  const fakeUsername = 'non_existing_username';
  Cache.database.savedUsers = [{ username: fakeUsername }];

  await Cache.refreshUsers();
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.USERNAME_WAS_NOT_REFRESHED(fakeUsername),
  );
});

test('cache.index.Cache.sortUsers method', async () => {
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
    {
      username: 'user_7',
      solved: undefined,
    },
    {
      username: 'user_8',
      solved: undefined,
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
    {
      username: 'user_7',
      solved: undefined,
    },
    {
      username: 'user_8',
      solved: undefined,
    },
  ];

  unsortedUsers.forEach((user) => Cache.users.push(user));

  await Cache.sortUsers();

  expect(_.isEqual(Cache.users, sortedUsers)).toBe(true);
});

test('cache.index.Cache.addUser method', async () => {
  await Cache.addUser('random_username');

  const firstUserData = Cache.users[0];

  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.avatar).toBe('https://example.com/random_link');
  expect(firstUserData.submissions.length).toBe(2);

  const firstUserDataDirect = (
    await getLeetcodeDataFromUsername('random_username')
  );

  expect(_.isEqual(firstUserData, firstUserDataDirect)).toBe(true);

  // Test User Limit
  const userLimit = 1;
  Cache.userLimit = userLimit;
  const secondUsername = 'random_username_2';
  const result = await Cache.addUser(secondUsername);
  expect(result.status).toBe(constants.STATUS.ERROR);
  expect(result.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(
      secondUsername, userLimit,
    ),
  );
  Cache.userLimit = 30;
});

test('cache.index.Cache.removeUser method', async () => {
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');

  expect(Cache.userAmount).toBe(2);

  await Cache.removeUser('random_username');

  expect(Cache.userAmount).toBe(1);

  const userLeft = Cache.users[0];

  expect(userLeft.name).toBe('Random User Name 2');
});

test('cache.index.Cache.clearUsers method', async () => {
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');

  expect(Cache.userAmount).toBe(2);

  await Cache.clearUsers();

  expect(Cache.userAmount).toBe(0);
});

test('cache.index.Cache.loadUser method', async () => {
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');

  const userData = await getLeetcodeDataFromUsername('random_username');
  const cachedUserData = await Cache.loadUser('random_username');

  expect(_.isEqual(userData, cachedUserData)).toBe(true);

  expect(await Cache.loadUser('not_existing_user')).toBe(false);

  await Cache.removeUser('random_username');

  expect(await Cache.loadUser('random_username')).toBe(false);
});
