/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop */
import * as dayjs from 'dayjs';

import getLeetcodeDataFromUsername from '../leetcode';
import Database from '../database';
import { delay } from '../utils/helper';
import { constants } from '../utils/constants';

import { ChannelCache } from './channel';
import { UserCache } from './userCache';
import { ChannelKey } from './models/channel.model';

class Cache {
  channels: Map<ChannelKey, ChannelCache> = new Map<ChannelKey, ChannelCache>();

  database = Database;

  userLimit: number = constants.SYSTEM.USER_AMOUNT_LIMIT;

  getLeetcodeDataFromUsername: CallableFunction = getLeetcodeDataFromUsername;

  delayTime: number = constants.SYSTEM.USER_REQUEST_DELAY_MS;

  delay = delay;

  lastRefreshedAt: dayjs.Dayjs;

  /**
   * Get the channel data from the database, create a channel cache from the
   * channel data, and add the channel cache to the map.
   * @param {ChannelKey} channelKey - The key of the channel to register.
   * @returns A ChannelCache object.
   */
  public async registerChannel(channelKey: ChannelKey): Promise<ChannelCache> {
    // Get Channel Data from Database
    const channelData = await this.database.getChannel(channelKey);

    // Create Channel Cache from Channel Data
    const channelCache = new ChannelCache(channelData);

    // Add Channel Cache to map
    this.channels.set(channelKey, channelCache);

    return channelCache;
  }

  /**
   * It refreshes the user cache and gets all the channel data from the
   * database.
   */
  async preload() {
    // Refresh Users from Database
    await UserCache.refresh();

    // Get all Channel IDs from Database
    const channelDataList = await this.database.getAllChannels();

    for (let i = 0; i < channelDataList.length; i++) {
      const channelData = channelDataList[i];
      const channelCache = new ChannelCache(channelData);
      this.channels.set(channelData.key, channelCache);
      await channelCache.preload();
    }
  }

  /**
   * Get a channel from the cache
   * @param {ChannelKey} channelKey - The key of the channel to get.
   * @returns The channel cache.
   */
  getChannel(channelKey: ChannelKey): ChannelCache {
    return this.channels.get(channelKey);
  }
}

export default new Cache();
