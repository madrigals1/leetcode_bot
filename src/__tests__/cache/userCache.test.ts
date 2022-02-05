/* eslint-disable no-console */
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

import Cache from '../../cache';
import { mockGetLeetcodeDataFromUsername } from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { users, mockDatabaseData } from '../__mocks__/data.mock';
import dictionary from '../../utils/dictionary';
import constants from '../../utils/constants';
import { CacheResponse } from '../../cache/models/response.model';
import { User } from '../../leetcode/models';
import { delay } from '../../utils/helper';
import { UserCache } from '../../cache/userCache';

Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
Cache.delayTime = 0;

const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

beforeEach(async () => {
  await UserCache.clear();
});

test('cache.UserCache.getAllUsers method', () => {
  // Expect default Cache.users to be array
  expect(Array.isArray(UserCache.users)).toBe(true);
  expect(Array.isArray(UserCache.getAllUsers())).toBe(true);
});

test('cache.UserCache.userAmount property', async () => {
  // User amount is 0 by default
  expect(UserCache.userAmount).toBe(0);

  // Add 1st User
  const realUsername = 'random_username';
  const addedUser: User = await UserCache.addUser(realUsername);
  expect(addedUser).toBeTruthy();
  expect(UserCache.userAmount).toBe(1);

  // Add 2nd User
  const realUsername2 = 'random_username_2';
  const addedUser2: User = await UserCache.addUser(realUsername2);
  expect(addedUser2).toBeTruthy();
  expect(UserCache.userAmount).toBe(2);

  // Clear Users
  await UserCache.clear();
  expect(UserCache.userAmount).toBe(0);
});

test('cache.UserCache.addOrReplaceUser method', async () => {
  // Add User
  await UserCache.addUser('random_username');

  // Check if User Data is correct
  const firstUserData: User = UserCache.getAllUsers()[0];
  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.profile.userAvatar)
    .toBe('https://example.com/random_link');
  expect(firstUserData.computed.submissions.length).toBe(2);

  // Replace 1st User with 2nd User and compare data
  const secondUserDataBefore: User = (
    await mockGetLeetcodeDataFromUsername('random_username_2')
  );
  UserCache.addOrReplaceUser('random_username', secondUserDataBefore);
  const secondUserData: User = UserCache.getAllUsers()[0];
  expect(JSON.stringify(secondUserDataBefore))
    .toBe(JSON.stringify(secondUserData));
  expect(UserCache.userAmount).toBe(1);

  // Replace non-existing User with 1st User (Add)
  const firstUserReaddedBefore: User = (
    await mockGetLeetcodeDataFromUsername('random_username')
  );
  UserCache.addOrReplaceUser('unexisting_username', firstUserReaddedBefore);
  const firstUserReaddedAfter: User = UserCache.getAllUsers()[1];
  expect(JSON.stringify(firstUserReaddedBefore))
    .toBe(JSON.stringify(firstUserReaddedAfter));
  expect(UserCache.userAmount).toBe(2);
});

test('cache.UserCache.refresh method', async () => {
  // Save original array
  const usersClone: User[] = _.cloneDeep(users);

  // Adding in this order, because they will be sorted by solved count
  await UserCache.addUser('random_username');
  await UserCache.addUser('random_username_2');

  // Change values in LeetCode Mock, refresh and check
  users[0].name = 'New Name 1';
  users[1].name = 'New Name 2';
  await UserCache.refresh();
  expect(UserCache.users[0].name).toBe('New Name 1');
  expect(UserCache.users[1].name).toBe('New Name 2');

  // Clear array and bring back original array
  users.length = 0;
  usersClone.forEach((user: User) => users.push(user));

  // Check already refreshed case
  UserCache.lastRefreshedAt = dayjs();
  const result: CacheResponse = await UserCache.refresh();
  expect(result.status).toBe(constants.STATUS.ERROR);
  expect(result.detail).toBe(BM.CACHE_ALREADY_REFRESHED);
  expect(console.log).toHaveBeenCalledWith(SM.CACHE_ALREADY_REFRESHED);
  UserCache.lastRefreshedAt = undefined;

  // Check case, where User is deleted from LeetCode
  const fakeUsername = 'non_existing_username';
  mockDatabaseData.users = [fakeUsername];
  await UserCache.refresh();
  expect(console.log).toHaveBeenCalledWith(
    SM.USERNAME_WAS_NOT_REFRESHED(fakeUsername),
  );
  Cache.lastRefreshedAt = undefined;

  // Check error logging
  const fakeErrorMessage = 'Fake error';
  Cache.delay = () => { throw new Error(fakeErrorMessage); };
  await UserCache.refresh();
  expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);
  Cache.delay = delay;
});

// test('cache.UserCache.sortUsers method', async () => {
//   const unsortedUsers: Record<string, string | number>[] = [
//     {
//       username: 'user_1',
//       solved: 123,
//     },
//     {
//       username: 'user_2',
//       solved: 0,
//     },
//     {
//       username: 'user_3',
//       solved: 23,
//     },
//     {
//       username: 'user_4',
//       solved: 1452,
//     },
//     {
//       username: 'user_5',
//       solved: 700,
//     },
//     {
//       username: 'user_6',
//       solved: 0,
//     },
//     {
//       username: 'user_7',
//       solved: undefined,
//     },
//     {
//       username: 'user_8',
//       solved: undefined,
//     },
//   ];

//   const sortedUsers: Record<string, string | number>[] = [
//     {
//       username: 'user_4',
//       solved: 1452,
//     },
//     {
//       username: 'user_5',
//       solved: 700,
//     },
//     {
//       username: 'user_1',
//       solved: 123,
//     },
//     {
//       username: 'user_3',
//       solved: 23,
//     },
//     {
//       username: 'user_2',
//       solved: 0,
//     },
//     {
//       username: 'user_6',
//       solved: 0,
//     },
//     {
//       username: 'user_7',
//       solved: undefined,
//     },
//     {
//       username: 'user_8',
//       solved: undefined,
//     },
//   ];

//   const sortedUsersModified: User[] = (
//     sortedUsers.map((user) => ({ ...mockUser1, ...user }))
//   );
//   unsortedUsers.forEach((user) => (
//     UserCache.users.set(user.username, { ...mockUser1, ...user })
//   ));

//   UserCache.sortUsers();

//   expect(_.isEqual(Cache.users, sortedUsersModified)).toBe(true);
// });

test('cache.UserCache.addUser method', async () => {
  // Add 1st User
  const realUsername = 'random_username';
  const addedUser: User = await UserCache.addUser(realUsername);
  expect(addedUser).toBeTruthy();
  const firstUserData: User = UserCache.getAllUsers()[0];
  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.profile.userAvatar)
    .toBe('https://example.com/random_link');
  expect(firstUserData.computed.submissions.length).toBe(2);
  const firstUserDataDirect: User = (
    await mockGetLeetcodeDataFromUsername('random_username')
  );
  expect(_.isEqual(firstUserData, firstUserDataDirect)).toBe(true);

  // // Test User Limit
  // const userLimit = 1;
  // Cache.userLimit = userLimit;
  // const secondUsername = 'random_username_2';
  // const resultFailUserLimit: CacheResponse = (
  //   await Cache.addUser(secondUsername)
  // );
  // expect(resultFailUserLimit.status).toBe(constants.STATUS.ERROR);
  // expect(resultFailUserLimit.detail).toBe(
  //   BM.USERNAME_NOT_ADDED_USER_LIMIT(secondUsername, userLimit),
  // );
  // Cache.userLimit = 30;

  // // Test Remove User if not exist in LeetCode
  // const fakeUsername = 'not_existing_username';
  // const resultFailNotExists: CacheResponse = (
  //   await Cache.addUser(fakeUsername)
  // );
  // expect(resultFailNotExists.status).toBe(constants.STATUS.ERROR);
  // expect(resultFailNotExists.detail).toBe(
  //   BM.USERNAME_NOT_FOUND_ON_LEETCODE(fakeUsername),
  // );

  // // Test Username already exists
  // const resultFailAlreadyExists: CacheResponse = (
  //   await Cache.addUser(realUsername)
  // );
  // expect(resultFailAlreadyExists.status).toBe(constants.STATUS.ERROR);
  // expect(resultFailAlreadyExists.detail).toBe(
  //   BM.USERNAME_ALREADY_EXISTS(realUsername),
  // );
});

// test('cache.UserCache.removeUser method', async () => {
//   // Add 2 Users
//   await UserCache.addUser('random_username');
//   await UserCache.addUser('random_username_2');
//   expect(UserCache.userAmount).toBe(2);

//   // Remove existing User
//   const realUsername = 'random_username';
//   const result: CacheResponse = await UserCache.removeUser(realUsername);
//   expect(Cache.userAmount).toBe(1);
//   expect(result.status).toBe(constants.STATUS.SUCCESS);
//   expect(result.detail).toBe(BM.USERNAME_WAS_DELETED(realUsername));

//   // Check remaining User
//   const userLeft: User = Cache.users[0];
//   expect(userLeft.name).toBe('Random User Name 2');

//   // Remove unexisting User
//   const fakeUsername = 'not_existing_user';
//   const resultFail: CacheResponse = await Cache.removeUser(fakeUsername);
//   expect(resultFail.status).toBe(constants.STATUS.ERROR);
//   expect(resultFail.detail).toBe(BM.USERNAME_NOT_FOUND(fakeUsername));
// });

test('cache.UserCache.clear method', async () => {
  // Add 2 Users
  await UserCache.addUser('random_username');
  await UserCache.addUser('random_username_2');
  expect(UserCache.userAmount).toBe(2);

  // Clear Users
  await UserCache.clear();
  expect(UserCache.userAmount).toBe(0);

  // // Check case, where clearing Users fails
  // mockDatabaseData.fakeResult = false;
  // const resultFail: CacheResponse = await Cache.clearUsers();
  // expect(resultFail.status).toBe(constants.STATUS.ERROR);
  // expect(resultFail.detail).toBe(BM.DATABASE_WAS_NOT_CLEARED);
});

test('cache.UserCache.getUser method', async () => {
  // Add 2 Users
  await UserCache.addUser('random_username');
  await UserCache.addUser('random_username_2');

  // Check if loadUser returns correct data
  const userData: User = (
    await mockGetLeetcodeDataFromUsername('random_username')
  );
  const cachedUserData: User = UserCache.getUser('random_username');
  expect(_.isEqual(userData, cachedUserData)).toBe(true);

  // Shouldn't be able to remove unexisting User
  expect(UserCache.getUser('not_existing_user')).toBeFalsy();

  // Shouldn't be able to remove already removed User
  // await UserCache.removeUser('random_username');
  // expect(_.isEmpty(Cache.loadUser('random_username'))).toBe(true);
});
