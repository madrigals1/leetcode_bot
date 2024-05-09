/* eslint-disable no-console */
import Cache from '../../cache';
import MockDatabaseProvider from '../__mocks__/database.mock';
import {
  generateChannelKey, generateChannelCache,
} from '../__mocks__/generators';
import { users } from '../__mocks__/data.mock';
import { UserCache } from '../../cache/userCache';
import { mockGetLeetcodeDataFromUsername } from '../__mocks__/utils.mock';
import { randomString } from '../__mocks__/randomUtils.test';

Cache.database = new MockDatabaseProvider();
UserCache.getLeetcodeDataFromUsername = mockGetLeetcodeDataFromUsername;

const realUsername1 = users[0].username!;
const realUsername2 = users[1].username!;

function _startup() {
  Cache.removeAllChannels();
}

beforeEach(_startup);

describe('cache.index - channelAmount property', () => {
  test('Correct case - 0 channels', async () => {
    expect(Cache.channelAmount).toBe(0);
  });

  test('Correct case - 2 channels', async () => {
    // Add 2 channels
    Cache.channels.set(randomString(), await generateChannelCache());
    Cache.channels.set(randomString(), await generateChannelCache());

    expect(Cache.channelAmount).toBe(2);
  });

  test('Correct case - Correct amount after deleting', async () => {
    const randomKey1 = randomString();
    const randomKey2 = randomString();

    // Add 2 channels
    Cache.channels.set(randomKey1, await generateChannelCache());
    Cache.channels.set(randomKey2, await generateChannelCache());

    expect(Cache.channelAmount).toBe(2);

    // Remove 1 channel
    Cache.channels.delete(randomKey1);

    expect(Cache.channelAmount).toBe(1);

    // Remove last channel
    Cache.channels.delete(randomKey2);

    expect(Cache.channelAmount).toBe(0);
  });
});

test('cache.index - registerChannel method', async () => {
  const channelKey = generateChannelKey();

  // Register new Channel
  const newChannel = await Cache.registerChannel(channelKey);

  // Check results
  expect(newChannel.channel).not.toBeUndefined();
  expect(newChannel.channel.key).toBe(channelKey);
  expect(Cache.channels.get(JSON.stringify(channelKey))).not.toBeUndefined();
});

describe('cache.index - setChannel method', () => {
  test('Correct case - Should be able set new Channel', async () => {
    const channelCache = await generateChannelCache();
    const { channel } = channelCache;
    const keyAsString = JSON.stringify(channel.key);

    // Set channel
    Cache.setChannel(channelCache);

    // Check results
    expect(Cache.channels.get(keyAsString)).not.toBeUndefined();
  });
});

describe('cache.index - preload method', () => {
  beforeEach(_startup);

  test('Correct case - Should be able to get multiple channels', async () => {
    // Register multiple channels
    const channel1 = await Cache.registerChannel(generateChannelKey());
    const channel2 = await Cache.registerChannel(generateChannelKey());

    // Remove channels only from Cache
    Cache.channels.delete(JSON.stringify(channel1.channel.key));
    Cache.channels.delete(JSON.stringify(channel2.channel.key));

    // Preload
    await Cache.preload();

    // Both channels should exist in Cache
    expect(Cache.channels.get(JSON.stringify(channel1.channel.key)))
      .not.toBeUndefined();
    expect(Cache.channels.get(JSON.stringify(channel2.channel.key)))
      .not.toBeUndefined();
  });

  test('Correct case - Should fetch 0 channels', async () => {
    // Preload
    await Cache.preload();

    // Should have 0 channels
    expect(Cache.channels.size).toBe(0);
  });
});

describe('cache.index - getChannel method', () => {
  beforeEach(_startup);

  test('Correct case - Should be able to get existing channel', async () => {
    const channel = await Cache.registerChannel(generateChannelKey());
    expect(Cache.getChannel(channel.channel.key)).not.toBeUndefined();
  });

  test('Incorrect case - Should not fetch non-existent channel', async () => {
    expect(Cache.getChannel(generateChannelKey())).toBeUndefined();
  });
});

describe('cache.index - clearChannel method', () => {
  beforeEach(_startup);

  test('Correct case - Should be able to get existing channel', async () => {
    const channel = await Cache.registerChannel(generateChannelKey());

    // Add 2 users to channel
    await channel.addUser(realUsername1);
    await channel.addUser(realUsername2);
    expect(channel.userAmount).toBe(2);

    // Clear channel
    await Cache.clearChannel(channel.channel.key);

    expect(channel.userAmount).toBe(0);
  });
});

describe('cache.index - removeAllChannels method', () => {
  beforeEach(_startup);

  test('Correct case - Should clear multiple channels', async () => {
    // Register 2 channels
    await Cache.registerChannel(generateChannelKey());
    await Cache.registerChannel(generateChannelKey());

    expect(Cache.channels.size).toBe(2);

    // Remove all channels
    await Cache.removeAllChannels();

    expect(Cache.channels.size).toBe(0);
  });
});
