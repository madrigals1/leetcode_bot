import { log } from '../utils/helper';

import { LBBChannelKey, LBBUserOnlyUsername } from './models';
import ApiService from './apiService';

class Cache {
  channelKeyIdMap = new Map<string, number>();

  usernameIdMap = new Map<string, number>();

  async preload(): Promise<void> {
    // Load Usernames and IDs
    const users: LBBUserOnlyUsername[] = await ApiService
      .fetchUsersOnlyUsernames()
      .catch((err) => {
        log(err);
        return [] as LBBUserOnlyUsername[];
      });

    users.forEach((user: LBBUserOnlyUsername) => {
      this.addUsernameId(user.username, user.id);
    });

    // Load Usernames and IDs
    const channelKeys: LBBChannelKey[] = await ApiService
      .fetchChannelsOnlyKeys()
      .catch((err) => {
        log(err);
        return [] as LBBChannelKey[];
      });

    channelKeys.forEach((channelKey: LBBChannelKey) => {
      this.addChannelId(channelKey, channelKey.id);
    });
  }

  static getKeyWithoutId(key: LBBChannelKey): LBBChannelKey {
    return {
      chat_id: key.chat_id,
      provider: key.provider,
    };
  }

  addChannelId(key: LBBChannelKey, id: number): void {
    this.channelKeyIdMap.set(
      JSON.stringify(Cache.getKeyWithoutId(key)), id,
    );
  }

  getChannelId(key: LBBChannelKey): number {
    return this.channelKeyIdMap.get(
      JSON.stringify(Cache.getKeyWithoutId(key)),
    );
  }

  addUsernameId(username: string, id: number): void {
    this.usernameIdMap.set(username, id);
  }

  getUsernameId(username: string): number {
    return this.usernameIdMap.get(username);
  }
}

export default new Cache();
