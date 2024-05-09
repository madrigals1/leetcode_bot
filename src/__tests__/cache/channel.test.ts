/* eslint-disable no-console */
import Cache from '../../cache';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { UserCache } from '../../cache/userCache';
import { mockGetLeetcodeDataFromUsername } from '../__mocks__/utils.mock';
import { user2, user1 } from '../__mocks__/data.mock';
import { constants } from '../../global/constants';
import { generateChannelCache } from '../__mocks__/generators';

// Change mock values
Cache.database = new MockDatabaseProvider();
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
UserCache.delayTime = 0;

// Prepare values
const realUsername1 = user1.username!;
const realUsername2 = user2.username!;

async function _startup() {
  UserCache.clear();
}

test('cache.channel - constructor method', async () => {
  const channelCache = await generateChannelCache();
  const createdChannel = await Cache.database
    .getChannel(channelCache.channel.key);
  expect(createdChannel).toBeTruthy();
});

describe('cache.channel - preload method', () => {
  beforeEach(_startup);

  test('Correct case - 2 users', async () => {
    const channelCache = await generateChannelCache();
    const { channel } = channelCache;

    // Add 2 Users to UserCache
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);

    // Add Users to Channel
    await Cache.database.addUserToChannel(channel.key, realUsername1);
    await Cache.database.addUserToChannel(channel.key, realUsername2);

    await channelCache.preload();

    expect(channelCache.users).toHaveLength(2);
  });

  test('Correct case - 0 users', async () => {
    const channelCache = await generateChannelCache();

    await channelCache.preload();

    expect(channelCache.users).toHaveLength(0);
  });

  test('Incorrect case - Error when getting Users for Channel', async () => {
    const channelCache = await generateChannelCache();
    const { getUsersForChannel } = Cache.database;
    const fakeErrorMessage = 'fake error messsage';

    // Change method to incorrect one
    Cache.database.getUsersForChannel = () => new Promise((resolve, reject) => {
      reject(fakeErrorMessage);
    });

    await channelCache.preload();

    // Check error being logged
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);

    // Return original method back
    Cache.database.getUsersForChannel = getUsersForChannel;
  });
});

describe('cache.channel - addUser method', () => {
  beforeEach(_startup);

  test('Correct case - User existing in Cache is added', async () => {
    const channelCache = await generateChannelCache();

    // Add User to UserCache
    await UserCache.addUser(realUsername1);

    expect(UserCache.userAmount).toBe(1);

    // Add User to Channel
    const result = await channelCache.addUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail)
      .toBe(`<b>${realUsername1}</b> - ✅ User is successfully added\n`);
    expect(UserCache.userAmount).toBe(1);
  });

  test('Correct case - User NOT existing in Cache is added', async () => {
    const channelCache = await generateChannelCache();

    expect(UserCache.userAmount).toBe(0);

    // Add User to Channel
    const result = await channelCache.addUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail)
      .toBe(`<b>${realUsername1}</b> - ✅ User is successfully added\n`);
    expect(UserCache.userAmount).toBe(1);
  });

  test('Incorrect case - Adding same User again', async () => {
    const channelCache = await generateChannelCache();

    // Add User to Channel
    const result1 = await channelCache.addUser(realUsername1);
    expect(result1.status).toBe(constants.STATUS.SUCCESS);
    expect(result1.detail)
      .toBe(`<b>${realUsername1}</b> - ✅ User is successfully added\n`);
    expect(channelCache.userAmount).toBe(1);

    // Re-add User to Channel
    const result2 = await channelCache.addUser(realUsername1);
    expect(result2.status).toBe(constants.STATUS.ERROR);
    expect(result2.detail)
      .toBe(`<b>${realUsername1}</b> - ❗ User already exists in this channel\n`);
    expect(channelCache.userAmount).toBe(1);
  });

  test('Incorrect case - Error when adding User to Channel', async () => {
    const channelCache = await generateChannelCache();
    const { addUserToChannel } = Cache.database;
    const fakeErrorMessage = 'fake error messsage';

    // Change method to incorrect one
    Cache.database.addUserToChannel = () => new Promise((resolve, reject) => {
      reject(fakeErrorMessage);
    });

    const result = await channelCache.addUser(realUsername1);

    // Check result
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe('❗ Error on the server');

    // Check error being logged
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);

    // Return original method back
    Cache.database.addUserToChannel = addUserToChannel;
  });
});

describe('cache.channel - removeUser method', () => {
  beforeEach(_startup);

  test('Correct case - Delete User', async () => {
    const channelCache = await generateChannelCache();

    // Add User to Channel
    await channelCache.addUser(realUsername1);

    expect(UserCache.userAmount).toBe(1);
    expect(channelCache.userAmount).toBe(1);

    // Remove User from Channel
    const result = await channelCache.removeUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail)
      .toBe(`✅ User <b>${realUsername1}</b> was successfully deleted`);
    expect(UserCache.userAmount).toBe(1);
    expect(channelCache.userAmount).toBe(0);
  });

  test('Incorrect case - Username does not exist', async () => {
    const channelCache = await generateChannelCache();

    // Remove User from Channel
    const result = await channelCache.removeUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail)
      .toBe(`❗ User <b>${realUsername1}</b> does not exist in this channel`);
  });

  test('Incorrect case - Error when removing User from Channel', async () => {
    const channelCache = await generateChannelCache();
    const { removeUserFromChannel } = Cache.database;
    const fakeErrorMessage = 'fake error messsage';

    // Change method to incorrect one
    Cache.database.removeUserFromChannel = () => (
      Promise.reject(fakeErrorMessage)
    );

    const result = await channelCache.removeUser(realUsername1);

    // Check result
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe('❗ Error on the server');

    // Check error being logged
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);

    // Return original method back
    Cache.database.removeUserFromChannel = removeUserFromChannel;
  });
});

describe('cache.channel - loadUser method', () => {
  beforeEach(_startup);

  test('Correct case - User exists', async () => {
    const channelCache = await generateChannelCache();

    // Add User
    await channelCache.addUser(realUsername1);

    const result = channelCache.loadUser(realUsername1);

    expect(result).not.toBeUndefined();
    expect(result.username).toBe(realUsername1);
  });

  test('Correct case - User does not exist', async () => {
    const channelCache = await generateChannelCache();

    const result = channelCache.loadUser(realUsername1);

    expect(result).toBeUndefined();
  });
});

describe('cache.channel - clear method', () => {
  beforeEach(_startup);

  test('Correct case - Channel with 2 users', async () => {
    const channelCache = await generateChannelCache();

    // Add 2 Users
    await channelCache.addUser(realUsername1);
    await channelCache.addUser(realUsername2);

    expect(channelCache.userAmount).toBe(2);

    // Clear
    const result = await channelCache.clear();

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe('✅ Channel was cleared');
    expect(channelCache.userAmount).toBe(0);
  });

  test('Correct case - Channel with 0 users', async () => {
    const channelCache = await generateChannelCache();

    expect(channelCache.userAmount).toBe(0);

    // Clear
    const result = await channelCache.clear();

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe('✅ Channel was cleared');
    expect(channelCache.userAmount).toBe(0);
  });

  test('Incorrect case - Channel was not cleared', async () => {
    const channelCache = await generateChannelCache();
    const { clearChannel } = Cache.database;

    // Change method to mock version
    Cache.database.clearChannel = () => new Promise((resolve) => {
      resolve(false);
    });

    const result = await channelCache.clear();

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe('❗ Channel was not cleared');

    // Bring back original method
    Cache.database.clearChannel = clearChannel;
  });

  test('Incorrect case - Error when clearing channel', async () => {
    const channelCache = await generateChannelCache();
    const { clearChannel } = Cache.database;
    const fakeErrorMessage = 'fake error message';

    // Change method to mock version
    Cache.database.clearChannel = () => new Promise((resolve, reject) => {
      reject(fakeErrorMessage);
    });

    const result = await channelCache.clear();

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail).toBe('❗ Error on the server');
    expect(console.log).toHaveBeenCalledWith(fakeErrorMessage);

    // Bring back original method
    Cache.database.clearChannel = clearChannel;
  });
});

test('cache.channel - Add same User in 2 channels', async () => {
  const channelCache1 = await generateChannelCache();
  const channelCache2 = await generateChannelCache();

  expect(channelCache1.userAmount).toBe(0);
  expect(channelCache2.userAmount).toBe(0);
  expect(UserCache.userAmount).toBe(0);

  // Add User 1 in Channel 1
  await channelCache1.addUser(realUsername1);

  expect(channelCache1.userAmount).toBe(1);
  expect(channelCache2.userAmount).toBe(0);
  expect(UserCache.userAmount).toBe(1);

  // Add User 1 in Channel 2
  await channelCache2.addUser(realUsername1);

  expect(channelCache1.userAmount).toBe(1);
  expect(channelCache2.userAmount).toBe(1);
  expect(UserCache.userAmount).toBe(1);

  // Add User 2 in Channel 1
  await channelCache1.addUser(realUsername2);

  expect(channelCache1.userAmount).toBe(2);
  expect(channelCache2.userAmount).toBe(1);
  expect(UserCache.userAmount).toBe(2);

  // Add User 2 in Channel 2
  await channelCache2.addUser(realUsername2);

  expect(channelCache1.userAmount).toBe(2);
  expect(channelCache2.userAmount).toBe(2);
  expect(UserCache.userAmount).toBe(2);
});
