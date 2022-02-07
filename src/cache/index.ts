/* eslint-disable no-await-in-loop */
import Database from '../database';
import { constants } from '../utils/constants';

import { ChannelCache } from './channel';
import { UserCache } from './userCache';
import { ChannelKey } from './models/channel.model';

class Cache {
  channels: Map<string, ChannelCache> = new Map<string, ChannelCache>();

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
    this.channels.set(JSON.stringify(channelKey), channelCache);

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
      this.channels.set(JSON.stringify(channelData.key), channelCache);
      await channelCache.preload();
    }
  }

  /**
   * Get a channel from the cache
   * @param {ChannelKey} channelKey - The key of the channel to get.
   * @returns The channel cache.
   */
  getChannel(channelKey: ChannelKey): ChannelCache {
    return this.channels.get(JSON.stringify(channelKey));
  }

  /**
   * Clear the contents of a channel
   * @param {ChannelKey} channelKey - The key of the channel to clear.
   */
  clearChannel(channelKey: ChannelKey): void {
    this.channels.get(JSON.stringify(channelKey)).clear();
  }

  /**
   * Clear all channels
   */
  clearAllChannels(): void {
    [...Object.keys(this.channels)].forEach((channelKeyStr) => {
      this.clearChannel(JSON.parse(channelKeyStr));
    });
  }
}

export default new Cache();
