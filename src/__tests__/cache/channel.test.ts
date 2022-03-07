/* eslint-disable no-console */
import { ChannelCache } from '../../cache/channel';
import { ChannelData, ChannelKey } from '../../cache/models';
import { ChatbotProvider } from '../../chatbots';
import Cache from '../../cache';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { UserCache } from '../../cache/userCache';
import { mockGetLeetcodeDataFromUsername } from '../__mocks__/utils.mock';
import { capitalizeFirstLetter, generateString } from '../../utils/helper';
import { user2, user1 } from '../__mocks__/data.mock';
import { constants } from '../../utils/constants';
import { BOT_MESSAGES as BM } from '../../utils/dictionary';

// Change mock values
Cache.database = new MockDatabaseProvider();
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;
UserCache.delayTime = 0;

// Prepare values
const realUsername1 = user1.username;
const realUsername2 = user2.username;

async function _startup() {
  UserCache.clear();
}

async function generateChannelCache() {
  // Generate values
  const channelKey: ChannelKey = {
    chatId: generateString(10),
    provider: ChatbotProvider.Discord,
  };
  const channelData: ChannelData = {
    id: Math.floor(Math.random() * 10000),
    key: channelKey,
    userLimit: Math.floor(Math.random() * 10000),
  };

  // Create Channel in Database
  await Cache.database.addChannel(channelData);

  return new ChannelCache(channelData);
}

test('cache.channel - constructor method', async () => {
  const channelCache = await generateChannelCache();
  const createdChannel = await Cache.database
    .getChannel(channelCache.channelData.key);
  expect(createdChannel).toBeTruthy();
});

describe('cache.channel - preload method', () => {
  beforeEach(_startup);

  test('Correct case - 2 users', async () => {
    const channelCache = await generateChannelCache();
    const { channelData } = channelCache;

    // Add 2 Users to UserCache
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);

    // Add Users to Channel
    await Cache.database.addUserToChannel(channelData.key, realUsername1);
    await Cache.database.addUserToChannel(channelData.key, realUsername2);

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

describe('cache.channel - userAmount property', () => {
  beforeEach(_startup);

  test('Correct case - 2 users', async () => {
    const channelCache = await generateChannelCache();
    const { channelData } = channelCache;

    // Should have 0 users by default
    expect(channelCache.userAmount).toBe(0);

    // Add 2 Users to UserCache
    await UserCache.addUser(realUsername1);
    await UserCache.addUser(realUsername2);

    // Add 2 Users to Channel
    await Cache.database.addUserToChannel(channelData.key, realUsername1);
    await Cache.database.addUserToChannel(channelData.key, realUsername2);
    await channelCache.preload();

    expect(channelCache.userAmount).toBe(2);
  });

  test('Correct case - 0 users', async () => {
    const channelCache = await generateChannelCache();

    // Should have 0 users by default
    expect(channelCache.userAmount).toBe(0);

    // Preload to check, if any users where added
    await channelCache.preload();

    // Should have 0 users after preload
    expect(channelCache.userAmount).toBe(0);
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
    expect(result.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername1));
    expect(UserCache.userAmount).toBe(1);
  });

  test('Correct case - User NOT existing in Cache is added', async () => {
    const channelCache = await generateChannelCache();

    expect(UserCache.userAmount).toBe(0);

    // Add User to Channel
    const result = await channelCache.addUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername1));
    expect(UserCache.userAmount).toBe(1);
  });

  test('Incorrect case - Adding same User again', async () => {
    const channelCache = await generateChannelCache();

    // Add User to Channel
    const result1 = await channelCache.addUser(realUsername1);
    expect(result1.status).toBe(constants.STATUS.SUCCESS);
    expect(result1.detail).toBe(BM.USERNAME_WAS_ADDED(realUsername1));
    expect(channelCache.userAmount).toBe(1);

    // Re-add User to Channel
    const result2 = await channelCache.addUser(realUsername1);
    expect(result2.status).toBe(constants.STATUS.ERROR);
    expect(result2.detail).toBe(BM.USERNAME_ALREADY_EXISTS(realUsername1));
    expect(channelCache.userAmount).toBe(1);
  });

  test('Incorrect case - User limit is reached', async () => {
    const channelCache = await generateChannelCache();
    channelCache.channelData.userLimit = 1;

    // Add 1 User
    await channelCache.addUser(realUsername1);

    // Add 2nd User
    const result = await channelCache.addUser(realUsername2);
    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail)
      .toBe(BM.USERNAME_NOT_ADDED_USER_LIMIT(realUsername2, 1));
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

    await channelCache.addUser(realUsername1);

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
    expect(result.detail).toBe(BM.USERNAME_WAS_DELETED(realUsername1));
    expect(UserCache.userAmount).toBe(1);
    expect(channelCache.userAmount).toBe(0);
  });

  test('Correct case - Delete User with incorrect case username', async () => {
    const channelCache = await generateChannelCache();
    const capitalizedUsername = capitalizeFirstLetter(realUsername1);

    await channelCache.addUser(realUsername1);

    // Remove User to Channel
    const result = await channelCache.removeUser(capitalizedUsername);

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe(BM.USERNAME_WAS_DELETED(capitalizedUsername));
    expect(UserCache.userAmount).toBe(1);
    expect(channelCache.userAmount).toBe(0);
  });

  test('Incorrect case - Username does not exist', async () => {
    const channelCache = await generateChannelCache();

    // Remove User from Channel
    const result = await channelCache.removeUser(realUsername1);

    expect(result.status).toBe(constants.STATUS.ERROR);
    expect(result.detail)
      .toBe(BM.USERNAME_DOES_NOT_EXIST_IN_CHANNEL(realUsername1));
  });

  test('Incorrect case - Error when removing User from Channel', async () => {
    const channelCache = await generateChannelCache();
    const { removeUserFromChannel } = Cache.database;
    const fakeErrorMessage = 'fake error messsage';

    // Change method to incorrect one
    Cache.database.removeUserFromChannel = () => (
      new Promise((resolve, reject) => reject(fakeErrorMessage))
    );

    await channelCache.removeUser(realUsername1);

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
    expect(result.detail).toBe(BM.CHANNEL_WAS_CLEARED);
    expect(channelCache.userAmount).toBe(0);
  });

  test('Correct case - Channel with 0 users', async () => {
    const channelCache = await generateChannelCache();

    expect(channelCache.userAmount).toBe(0);

    // Clear
    const result = await channelCache.clear();

    expect(result.status).toBe(constants.STATUS.SUCCESS);
    expect(result.detail).toBe(BM.CHANNEL_WAS_CLEARED);
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
    expect(result.detail).toBe(BM.CHANNEL_WAS_NOT_CLEARED);

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
    expect(result.detail).toBe(BM.ERROR_ON_THE_SERVER);
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
