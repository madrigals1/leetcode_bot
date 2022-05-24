/* eslint-disable class-methods-use-this */
import {
  ChannelService, ChannelUserService, SubscriptionService, UserService,
} from './api';
import {
  LBBSubscription,
  LBBUser,
  LBBUsernameResponse,
  LBBUserOnlyUsername,
  LBBChannel,
  LBBChannelKey,
  LBBChannelUser,
} from './models';

class ApiService {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  async createChannel(channel: LBBChannel): Promise<LBBChannel> {
    return ChannelService.create(channel);
  }

  async getChannel(id: number): Promise<LBBChannel> {
    return ChannelService.get(id);
  }

  async fetchChannels(): Promise<LBBChannel[]> {
    return ChannelService.fetch();
  }

  async updateChannel(id: number, channel: LBBChannel): Promise<LBBChannel> {
    return ChannelService.update(id, channel);
  }

  async deleteChannel(id: number): Promise<boolean> {
    return ChannelService.delete(id);
  }

  async findChannelByKey(channelKey: LBBChannelKey): Promise<LBBChannel> {
    return ChannelService.findChannelByKey(channelKey);
  }

  async fetchChannelsOnlyKeys(): Promise<LBBChannelKey[]> {
    return ChannelService.fetchOnlyKeys();
  }

  async refreshChannel(id: number): Promise<boolean> {
    return ChannelService.refresh(id);
  }

  async clearChannel(id: number): Promise<boolean> {
    return ChannelService.clear(id);
  }

  async bulkAddUsersToChannel(
    channelId: number, usernames: string[],
  ): Promise<LBBUsernameResponse[]> {
    return ChannelService.bulkAddUsers(channelId, usernames);
  }

  async findUserInChannel(
    channelId: number, username: string,
  ): Promise<LBBUser> {
    return ChannelService.findUser(channelId, username);
  }

  async deleteUserFromChannelByUsername(
    channelId: number, username: string,
  ): Promise<boolean> {
    return ChannelService.deleteUser(channelId, username);
  }

  async fetchUsersForChannel(channelId: number): Promise<LBBUser[]> {
    return ChannelService.fetchUsers(channelId);
  }

  // ---------------------------------------------------------------------------
  // Channel User
  // ---------------------------------------------------------------------------

  async createChannelUser(
    channelUser: LBBChannelUser,
  ): Promise<LBBChannelUser> {
    return ChannelUserService.create(channelUser);
  }

  async getChannelUser(id: number): Promise<LBBChannelUser> {
    return ChannelUserService.get(id);
  }

  async fetchChannelUsers(): Promise<LBBChannelUser[]> {
    return ChannelUserService.fetch();
  }

  async updateChannelUser(
    id: number, channelUser: LBBChannelUser,
  ): Promise<LBBChannelUser> {
    return ChannelUserService.update(id, channelUser);
  }

  async deleteChannelUser(id: number): Promise<boolean> {
    return ChannelUserService.delete(id);
  }

  // ---------------------------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------------------------

  createSubscription(subscription: LBBSubscription): Promise<LBBSubscription> {
    return SubscriptionService.create(subscription);
  }

  getSubscription(id: number): Promise<LBBSubscription> {
    return SubscriptionService.get(id);
  }

  fetchSubscriptions(): Promise<LBBSubscription[]> {
    return SubscriptionService.fetch();
  }

  updateSubscription(
    id: number, subscription: LBBSubscription,
  ): Promise<LBBSubscription> {
    return SubscriptionService.update(id, subscription);
  }

  deleteSubscription(id: number): Promise<boolean> {
    return SubscriptionService.delete(id);
  }

  // ---------------------------------------------------------------------------
  // User
  // ---------------------------------------------------------------------------

  createUser(user: LBBUser): Promise<LBBUser> {
    return UserService.create(user);
  }

  getUser(id: number): Promise<LBBUser> {
    return UserService.get(id);
  }

  fetchUsers(): Promise<LBBUser[]> {
    return UserService.fetch();
  }

  updateUser(id: number, user: LBBUser): Promise<LBBUser> {
    return UserService.update(id, user);
  }

  deleteUser(id: number): Promise<boolean> {
    return UserService.delete(id);
  }

  getUserCount(channelId: number): Promise<number> {
    return UserService.getCount(channelId);
  }

  fetchUsersOnlyUsernames(): Promise<LBBUserOnlyUsername[]> {
    return UserService.fetchOnlyUsernames();
  }
}

export default new ApiService();
