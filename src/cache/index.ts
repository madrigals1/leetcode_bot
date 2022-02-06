/* eslint-disable no-await-in-loop */
import Database from '../database';
import { constants } from '../utils/constants';

import { ChannelCache } from './channel';
import { UserCache } from './userCache';
import { ChannelKey } from './models/channel.model';

class Cache {
  channels: Map<ChannelKey, ChannelCache> = new Map<ChannelKey, ChannelCache>();

  database = Database;

  /**
   * Get the channel data from the database, create a channel cache from the
   * channel data, and add the channel cache to the map.
   * @param {ChannelKey} channelKey - The key of the channel to register.
   * @returns A ChannelCache object.
   */
  public async registerChannel(channelKey: ChannelKey): Promise<ChannelCache> {
    // Create Channel Data in Database
    const channelData = await this.database.addChannel({
      key: channelKey,
      userLimit: constants.SYSTEM.USER_AMOUNT_LIMIT,
    });

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
