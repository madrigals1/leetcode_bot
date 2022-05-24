import { ChannelKey } from '../cache/models';

import ApiService from './apiService';
import { LBBUserOnlyUsername } from './models';

class Cache {
  channelKeyIdMap = new Map<string, number>();

  usernameIdMap = new Map<string, number>();

  async preload(): Promise<void> {
    // Load Usernames and IDs
    const users: LBBUserOnlyUsername[] = await ApiService
      .fetchUsersOnlyUsernames()
      .catch(() => [] as LBBUserOnlyUsername[]);

    users.forEach((user: LBBUserOnlyUsername) => {
      this.addUsernameId(user.username, user.id);
    });

    // Load Usernames and IDs
    const channelKeys: ChannelKey[] = await ApiService
      .fetchChannelsOnlyKeys()
      .catch(() => [] as ChannelKey[]);

    channelKeys.forEach((channelKey: ChannelKey) => {
      this.addChannelId(channelKey, channelKey.id);
    });
  }

  addChannelId(key: ChannelKey, id: number): void {
    this.channelKeyIdMap.set(JSON.stringify(key), id);
  }

  getChannelId(key: ChannelKey): number {
    return this.channelKeyIdMap.get(JSON.stringify(key));
  }

  addUsernameId(username: string, id: number): void {
    this.usernameIdMap.set(username, id);
  }

  getUsernameId(username: string): number {
    return this.usernameIdMap.get(username);
  }
}

export default new Cache();
