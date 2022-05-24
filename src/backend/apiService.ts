/* eslint-disable class-methods-use-this */
import { Channel, ChannelKey, ChannelUser } from '../cache/models';

import {
  ChannelService, ChannelUserService, SubscriptionService, UserService,
} from './api';
import {
  LBBSubscription,
  LBBUser,
  LBBUsernameResponse,
  LBBUserOnlyUsername,
} from './models';
import {
  convertChannelToLBB,
  convertChannelUserToLBB,
  convertLBBToChannel,
  convertLBBToChannelKey,
  convertLBBToChannelUser,
} from './converters';

class ApiService {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  async createChannel(channel: Channel): Promise<Channel> {
    return ChannelService
      .create(convertChannelToLBB(channel))
      .then(convertLBBToChannel);
  }

  async getChannel(id: number): Promise<Channel> {
    return ChannelService
      .get(id)
      .then(convertLBBToChannel);
  }

  async fetchChannels(): Promise<Channel[]> {
    return ChannelService
      .fetch()
      .then((channels) => channels?.map(convertLBBToChannel));
  }

  async updateChannel(id: number, channel: Channel): Promise<Channel> {
    return ChannelService
      .update(id, convertChannelToLBB(channel))
      .then(convertLBBToChannel);
  }

  async deleteChannel(id: number): Promise<boolean> {
    return ChannelService.delete(id);
  }

  async findChannelByKey(channelKey: ChannelKey): Promise<Channel> {
    return ChannelService
      .findChannelByKey(channelKey)
      .then(convertLBBToChannel);
  }

  async fetchChannelsOnlyKeys(): Promise<ChannelKey[]> {
    return ChannelService
      .fetchOnlyKeys()
      .then((keys) => keys?.map(convertLBBToChannelKey));
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

  // ---------------------------------------------------------------------------
  // Channel User
  // ---------------------------------------------------------------------------

  async createChannelUser(channelUser: ChannelUser): Promise<ChannelUser> {
    return ChannelUserService
      .create(convertChannelUserToLBB(channelUser))
      .then(convertLBBToChannelUser);
  }

  async getChannelUser(id: number): Promise<ChannelUser> {
    return ChannelUserService.get(id).then(convertLBBToChannelUser);
  }

  async fetchChannelUsers(): Promise<ChannelUser[]> {
    return ChannelUserService.fetch()
      .then((channelUsers) => channelUsers.map(convertLBBToChannelUser));
  }

  async updateChannelUser(
    id: number, channelUser: ChannelUser,
  ): Promise<ChannelUser> {
    return ChannelUserService
      .update(id, convertChannelUserToLBB(channelUser))
      .then(convertLBBToChannelUser);
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
