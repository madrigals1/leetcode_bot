/* eslint-disable class-methods-use-this */
import { Channel, ChannelKey } from '../cache/models';

import {
  ChannelService, ChannelUserService, SubscriptionService, UserService,
} from './api';
import {
  LBBChannel,
  LBBChannelKey,
  LBBChannelUser,
  LBBSubscription,
  LBBUser,
  LBBUserOnlyUsername,
} from './models';

class ApiService {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  createChannel(channel: Channel): Promise<LBBChannel> {
    return ChannelService.create(channel);
  }

  getChannel(id: number): Promise<LBBChannel> {
    return ChannelService.get(id);
  }

  fetchChannels(): Promise<LBBChannel[]> {
    return ChannelService.fetch();
  }

  updateChannel(id: number, channel: Channel): Promise<LBBChannel> {
    return ChannelService.update(id, channel);
  }

  deleteChannel(id: number): Promise<boolean> {
    return ChannelService.delete(id);
  }

  findChannelByKey(channelKey: ChannelKey): Promise<LBBChannel> {
    return ChannelService.findChannelByKey(channelKey);
  }

  fetchChannelsOnlyKeys(): Promise<LBBChannelKey[]> {
    return ChannelService.fetchOnlyKeys();
  }

  // ---------------------------------------------------------------------------
  // Channel User
  // ---------------------------------------------------------------------------

  createChannelUser(channelUser: LBBChannelUser): Promise<LBBChannelUser> {
    return ChannelUserService.create(channelUser);
  }

  getChannelUser(id: number): Promise<LBBChannelUser> {
    return ChannelUserService.get(id);
  }

  fetchChannelUsers(): Promise<LBBChannelUser[]> {
    return ChannelUserService.fetch();
  }

  updateChannelUser(
    id: number, channelUser: LBBChannelUser,
  ): Promise<LBBChannelUser> {
    return ChannelUserService.update(id, channelUser);
  }

  deleteChannelUser(id: number): Promise<boolean> {
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
