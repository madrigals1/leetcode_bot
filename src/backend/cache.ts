import { LBBChannelKey, LBBUserOnlyUsername } from './models';
import ApiService from './apiService';

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
    const channelKeys: LBBChannelKey[] = await ApiService
      .fetchChannelsOnlyKeys()
      .catch(() => [] as LBBChannelKey[]);

    channelKeys.forEach((channelKey: LBBChannelKey) => {
      this.addChannelId(channelKey, channelKey.id);
    });
  }

  addChannelId(key: LBBChannelKey, id: number): void {
    this.channelKeyIdMap.set(JSON.stringify(key), id);
  }

  getChannelId(key: LBBChannelKey): number {
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