/* eslint-disable class-methods-use-this */
import { Channel, ChannelKey } from '../cache/models';

import {
  ChannelService, ChannelUserService, SubscriptionService, UserService,
} from './api';
import {
  LBBChannelUser,
  LBBSubscription,
  LBBUser,
  LBBUserOnlyUsername,
} from './models';

class ApiService {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  createChannel(channel: Channel): Promise<Channel> {
    return ChannelService
      .create(channel)
      .then((res) => res.toChannel());
  }

  getChannel(id: number): Promise<Channel> {
    return ChannelService
      .get(id)
      .then((res) => res.toChannel());
  }

  fetchChannels(): Promise<Channel[]> {
    return ChannelService
      .fetch()
      .then((channels) => channels.map((res) => res.toChannel()));
  }

  updateChannel(id: number, channel: Channel): Promise<Channel> {
    return ChannelService
      .update(id, channel)
      .then((res) => res.toChannel());
  }

  deleteChannel(id: number): Promise<boolean> {
    return ChannelService.delete(id);
  }

  findChannelByKey(channelKey: ChannelKey): Promise<Channel> {
    return ChannelService
      .findChannelByKey(channelKey)
      .then((res) => res.toChannel());
  }

  fetchChannelsOnlyKeys(): Promise<ChannelKey[]> {
    return ChannelService
      .fetchOnlyKeys()
      .then((keys) => keys.map((res) => res.toChannelKey()));
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
