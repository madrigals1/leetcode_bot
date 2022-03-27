/* eslint-disable no-await-in-loop */
import Database from '../database';
import DatabaseProvider from '../database/database.proto';

import { ChannelCache } from './channel';
import { UserCache } from './userCache';
import { ChannelKey } from './models';

class Cache {
  channels: Map<string, ChannelCache> = new Map<string, ChannelCache>();

  database: DatabaseProvider = Database;

  /**
   * Get the number of channels in the channel list.
   * @returns The number of channels in the channel list.
   */
  get channelAmount(): number {
    return this.channels.size;
  }

  /**
   * Get the channel data from the database, create a channel cache from the
   * channel data, and add the channel cache to the map.
   * @param {ChannelKey} channelKey - The key of the channel to register.
   * @returns Promise with ChannelCache.
   */
  public async registerChannel(channelKey: ChannelKey): Promise<ChannelCache> {
    // Create Channel in Database
    const channel = await this.database.addChannel({ key: channelKey });

    // Create Channel Cache from Channel Data
    const channelCache = new ChannelCache(channel);

    // Add Channel Cache to map
    this.setChannel(channelCache);

    return channelCache;
  }

  /**
   * Set the channel cache in the channels map
   * @param {ChannelCache} channelCache - ChannelCache
   */
  public setChannel(channelCache: ChannelCache): void {
    const { channel } = channelCache;
    this.channels.set(JSON.stringify(channel.key), channelCache);
  }

  /**
   * Preload UserCache, load all channels from Database and recreate in Cache
   */
  async preload(): Promise<void> {
    // Preload Users from Database
    await UserCache.preload();

    // Get all Channel IDs from Database
    const channelList = await this.database.getAllChannels();

    await Promise.all(channelList.map((channel) => {
      const channelCache = new ChannelCache(channel);
      this.setChannel(channelCache);
      return channelCache.preload();
    }));
  }

  /**
   * Get a channel from the cache
   * @param {ChannelKey} channelKey - The key of the channel to get.
   * @returns ChannelCache.
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
