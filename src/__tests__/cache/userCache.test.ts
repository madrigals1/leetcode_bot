import * as _ from 'lodash';
import * as dayjs from 'dayjs';

import { mockGetLeetcodeDataFromUsername } from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { users, user2, user1 } from '../__mocks__/data.mock';
import {
  SERVER_MESSAGES as SM, BOT_MESSAGES as BM,
} from '../../utils/dictionary';
import { constants } from '../../utils/constants';
import { User } from '../../leetcode/models';
import { delay } from '../../utils/helper';
import { UserCache } from '../../cache/userCache';
import Cache from '../../cache';
import { randomString } from '../__mocks__/randomUtils.test';

// Use mock functionality
Cache.database = new MockDatabaseProvider();
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
UserCache.delayTime = 0;

// Prepare values
const realUsername1 = user1.username!;
const realUsername2 = user2.username!;
const fakeUsername = 'fake_username';

// Create setup and teardown functions
function _startup() {
  UserCache.clear();
}

function _shutdown() {
  UserCache.clear();
}

beforeEach(_startup);
afterEach(_shutdown);

test('cache.UserCache - userAmount property', async () => {
  // User amount is 0 by default
  expect(UserCache.userAmount).toBe(0);

  // Add 2 Users
  await UserCache.addUser(realUsername1);
  await UserCache.addUser(realUsername2);

  // Should have correct user amount
  expect(UserCache.userAmount).toBe(2);

  // Clear Users
  await UserCache.clear();
  expect(UserCache.userAmount).toBe(0);
});

describe('cache.UserCache - addUser method', () => {
  beforeEach(_startup);

  test('Correct case - Add 1 User', async () => {
    // Add one User
    const result = await UserCache.addUser(realUsername1);
    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername1));
    expect(result).not.toBeNull();

    // Check User data
    const firstUserData = UserCache.getAllUsers()[0];
    const firstUserDataDirect = (
      await mockGetLeetcodeDataFromUsername(realUsername1)
    );
    expect(_.isEqual(firstUserData, firstUserDataDirect)).toBe(true);
  });

  test('Correct case - Add 2 Users', async () => {
    // Add first User
    const firstResult = await UserCache.addUser(realUsername1);
    expect(firstResult.status).toBe(constants.STATUS.SUCCESS);
    expect(firstResult.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername1));
    expect(firstResult.user).not.toBeNull();

    // Add second User
    const secondResult = await UserCache.addUser(realUsername2);
    expect(secondResult).not.toBeNull();
    expect(secondResult.status).toBe(constants.STATUS.SUCCESS);
    expect(secondResult.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername2));
    expect(secondResult.user).not.toBeNull();

    // Check first User data
    const firstUserDataDirect = (
      await mockGetLeetcodeDataFromUsername(realUsername1)
    );
    expect(_.isEqual(firstResult.user, firstUserDataDirect)).toBe(true);

    // Check second User data
    const secondUserDataDirect = (
      await mockGetLeetcodeDataFromUsername(realUsername2)
    );
    expect(_.isEqual(secondResult.user, secondUserDataDirect)).toBe(true);
  });

  test('Incorrect case - Username does not exist in LeetCode', async () => {
    const result = await UserCache.addUser(fakeUsername);

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe(BM.USERNAME_NOT_FOUND_ON_LEETCODE(fakeUsername));
    expect(result.user).toBeNull();
  });

  test('Incorrect case - Username already exists in Database', async () => {
    // Add User 1st time
    await UserCache.addUser(realUsername1);

    // Add User 2nd time
    const result = await UserCache.addUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe(BM.USERNAME_ALREADY_EXISTS(realUsername1));
    expect(result.user).toBe(null);
  });

  test('Incorrect case - Error when getting User from LeetCode', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const actionWithError = (username: string): Promise<User> => (
      Promise.reject(new Error('fake error message'))
    );
    UserCache.getLeetcodeDataFromUsername = actionWithError;

    // Try adding User
    const result = await UserCache.addUser(fakeUsername);

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail)
      .toBe(BM.USERNAME_ADDING_ERROR(fakeUsername));
    expect(result.user).toBe(null);
    UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
  });
});

describe('cache.userCache - getUser method', () => {
  beforeEach(_startup);

  test('Correct case - User exists', async () => {
    // Add user first
    await UserCache.addUser(realUsername1);

    // Get User
    const user = UserCache.getUser(realUsername1);

    // Check User
    expect(user).not.toBeUndefined();
    expect(_.isEqual(user, user1)).toBe(true);
  });

  test('Incorrect case - User does not exist', async () => {
    // Get User
    const user = UserCache.getUser(fakeUsername);

    // Check User
    expect(user).toBeUndefined();
  });
});

describe('cache.userCache - getAllUsers method', () => {
  beforeEach(_startup);

  test('Correct case - 1 User exists', async () => {
    // Add User first
    await UserCache.addUser(realUsername1);

    // Get Users from Cache
    const gotUsers = UserCache.getAllUsers();

    expect(gotUsers).toHaveLength(1);
    expect(_.isEqual(gotUsers[0], user1)).toBe(true);
  });

  test('Correct case - 2 Users exist', async () => {
    // Add User first
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);

    // Get Users from Cache
    const gotUsers = UserCache.getAllUsers();

    expect(gotUsers).toHaveLength(2);
    expect(_.isEqual(gotUsers[0], user1)).toBe(true);
    expect(_.isEqual(gotUsers[1], user2)).toBe(true);
  });

  test('Correct case - 0 Users exist', async () => {
    // Get Users from Cache
    const gotUsers = UserCache.getAllUsers();

    expect(gotUsers).toHaveLength(0);
  });

  test('Neutral case - Should have correct types', async () => {
    // Expect default Cache.users to be array
    expect(UserCache.users instanceof Map).toBe(true);
    expect(Array.isArray(UserCache.getAllUsers())).toBe(true);
  });
});

describe('cache.UserCache - addOrReplaceUser method', () => {
  beforeEach(_startup);

  test('Correct case - Replace existing User', async () => {
    // Add User
    await UserCache.addUser(realUsername1);
    expect(UserCache.userAmount).toBe(1);

    // Replace 1st User with 2nd User and compare data
    UserCache.addOrReplaceUser(realUsername1, user2);

    // Get User with updated data
    const updatedUserData = UserCache.getAllUsers()[0];
    expect(_.isEqual(updatedUserData, user2)).toBe(true);

    // Amount of User should not be changed
    expect(UserCache.userAmount).toBe(1);
  });

  test('Neutral case - Replace not existing User', async () => {
    // By default there should be no Users
    expect(UserCache.userAmount).toBe(0);

    // Replace non-existing User with 1st User (Add)
    UserCache.addOrReplaceUser('unexisting_username', user1);

    // Check added User
    const addedUser = UserCache.getAllUsers()[0];
    expect(_.isEqual(addedUser, user1)).toBe(true);

    // User amount should be changed
    expect(UserCache.userAmount).toBe(1);
  });
});

describe('cache.UserCache - refresh method', () => {
  beforeEach(_startup);

  test('Correct case - Data on LeetCode is updated', async () => {
    UserCache.lastRefreshedAt = undefined;

    // Save original array
    const usersClone = _.cloneDeep(users);

    // Adding in this order, because they will be sorted by solved count
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);

    // Change values in LeetCode Mock, refresh and check
    users[0].name = 'New Name 1';
    users[1].name = 'New Name 2';
    await UserCache.refresh();
    expect(UserCache.getUser(realUsername1).name).toBe('New Name 1');
    expect(UserCache.getUser(realUsername2).name).toBe('New Name 2');

    // Clear array and bring back original array
    users.length = 0;
    usersClone.forEach((user: User) => users.push(user));
  });

  test('Incorrect case - Cache is already refreshing', async () => {
    UserCache.lastRefreshedAt = dayjs();

    // Refresh Cache
    const result = await UserCache.refresh();

    // Should throw error
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe(BM.CACHE_ALREADY_REFRESHED);
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(SM.CACHE_ALREADY_REFRESHED);

    UserCache.lastRefreshedAt = undefined;
  });

  test('Incorrect case - User is deleted from LeetCode', async () => {
    // Add fake User
    const fakeUsernameX = randomString();
    const fakeUser = { ...user1, username: fakeUsernameX };
    users.push(fakeUser);

    await UserCache.addUser(fakeUsernameX);

    // "Delete" User from LeetCode
    fakeUser.exists = false;

    // Refresh Cache
    await UserCache.refresh();

    // eslint-disable-next-line no-console
    expect(console.log)
      .toHaveBeenCalledWith(SM.USERNAME_WAS_NOT_REFRESHED(fakeUsernameX));

    _.remove(users, { username: fakeUsernameX });

    UserCache.lastRefreshedAt = undefined;
  });

  test('Incorrect case - Internal error', async () => {
    // Add 1 user
    await UserCache.addUser(realUsername1);

    // Check error logging
    const fakeErrorMessage = 'Fake error';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    UserCache.delay = (msTime: number) => new Promise((resolve, reject) => {
      reject(new Error(fakeErrorMessage));
    });

    await UserCache.refresh();
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);
    UserCache.delay = delay;
  });
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

describe('cache.UserCache.removeUser method', () => {
  beforeEach(_startup);

  test('Correct case - Remove single User', async () => {
    // Add 2 Users
    await UserCache.addUser(realUsername1);
    expect(UserCache.userAmount).toBe(1);

    // Remove existing User
    const result = await UserCache.removeUser(realUsername1);
    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe(BM.USERNAME_WAS_DELETED(realUsername1));
    expect(UserCache.userAmount).toBe(0);
  });

  test('Correct case - Remove 2 Users', async () => {
    // Add 2 Users
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);
    expect(UserCache.userAmount).toBe(2);

    // Should be able to get both Users
    expect(UserCache.users.get(realUsername1)).not.toBeUndefined();
    expect(UserCache.users.get(realUsername2)).not.toBeUndefined();

    // Remove first User
    const result1 = await UserCache.removeUser(realUsername1);
    expect(result1.status).toBe(constants.STATUS.SUCCESS);
    expect(result1.detail).toBe(BM.USERNAME_WAS_DELETED(realUsername1));
    expect(UserCache.userAmount).toBe(1);

    // Should only be able to get Existing User
    expect(UserCache.users.get(realUsername1)).toBeUndefined();
    expect(UserCache.users.get(realUsername2)).not.toBeUndefined();

    // Remove first User
    const result2 = await UserCache.removeUser(realUsername2);
    expect(result2.status).toBe(constants.STATUS.SUCCESS);
    expect(result2.detail).toBe(BM.USERNAME_WAS_DELETED(realUsername2));
    expect(UserCache.userAmount).toBe(0);

    // Should not be able to get any Users
    expect(UserCache.users.get(realUsername1)).toBeUndefined();
    expect(UserCache.users.get(realUsername2)).toBeUndefined();
  });

  test('Incorrect case - Try to delete user, that does not exist', async () => {
    // Add 1 User
    await UserCache.addUser(realUsername1);
    expect(UserCache.userAmount).toBe(1);

    // Remove unexisting User
    const result = await UserCache.removeUser(fakeUsername);
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe(BM.USERNAME_NOT_FOUND(fakeUsername));
    expect(UserCache.userAmount).toBe(1);
  });

  test('Incorrect case - Error when removing User from Database', async () => {
    const { removeUser } = Cache.database;
    const fakeErrorMessage = 'fake error messsage';

    // Change method to incorrect one
    Cache.database.removeUser = () => (
      Promise.reject(fakeErrorMessage)
    );

    const result = await UserCache.removeUser(realUsername1);

    // Check result
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe(BM.ERROR_ON_THE_SERVER);

    // Check error being logged
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);

    // Return original method back
    Cache.database.removeUser = removeUser;
  });
});

test('cache.UserCache - clear method', async () => {
  _startup();

  // Add 2 Users
  await UserCache.addUser(realUsername1);
  await UserCache.addUser(realUsername2);
  expect(UserCache.userAmount).toBe(2);

  // Clear Users
  await UserCache.clear();
  expect(UserCache.userAmount).toBe(0);
});
