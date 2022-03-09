/* eslint-disable no-await-in-loop */
import Database from '../database';
import DatabaseProvider from '../database/database.proto';
import { constants } from '../utils/constants';

import { ChannelCache } from './channel';
import { UserCache } from './userCache';
import { ChannelKey } from './models/channel.model';

class Cache {
  channels: Map<string, ChannelCache> = new Map<string, ChannelCache>();

  database: DatabaseProvider = Database;

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
    this.setChannel(channelCache);

    return channelCache;
  }

  /**
   * Set the channel cache in the channels map
   * @param {ChannelCache} channelCache - ChannelCache
   */
  public setChannel(channelCache: ChannelCache): void {
    const { channelData } = channelCache;
    this.channels.set(JSON.stringify(channelData.key), channelCache);
  }

  /**
   * It refreshes the user cache and gets all the channel data from the
   * database.
   */
  async preload(): Promise<void> {
    // Refresh Users from Database
    await UserCache.refresh();

    // Get all Channel IDs from Database
    const channelDataList = await this.database.getAllChannels();

    await Promise.all(channelDataList.map((channelData) => {
      const channelCache = new ChannelCache(channelData);
      this.setChannel(channelCache);
      return channelCache.preload();
    }));
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
  async clearChannel(channelKey: ChannelKey): Promise<void> {
    const existingChannel = this.channels.get(JSON.stringify(channelKey));
    if (existingChannel) await existingChannel.clear();
  }

  /**
   * Remove all channels from the channel list
   */
  async removeAllChannels(): Promise<void> {
    await this.database.deleteAllChannels();
    this.channels.clear();
  }
}

export default new Cache();
