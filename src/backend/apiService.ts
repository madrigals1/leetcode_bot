/* eslint-disable class-methods-use-this */
import { SubscriptionType } from '../chatbots/models';
import { KontestContest } from '../scheduler/kontest/models';

import {
  ChannelService,
  ChannelUserService,
  SubscriptionService,
  UserService,
  ContestService,
} from './api';
import { handleAPIError } from './api/errors';
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
    return ChannelService
      .create(channel)
      .catch(handleAPIError);
  }

  async getChannel(id: number): Promise<LBBChannel> {
    return ChannelService
      .get(id)
      .catch(handleAPIError);
  }

  async fetchChannels(): Promise<LBBChannel[]> {
    return ChannelService
      .fetch()
      .catch(handleAPIError);
  }

  async updateChannel(id: number, channel: LBBChannel): Promise<LBBChannel> {
    return ChannelService
      .update(id, channel)
      .catch(handleAPIError);
  }

  async deleteChannel(id: number): Promise<boolean> {
    return ChannelService
      .delete(id)
      .catch(handleAPIError);
  }

  async findChannelByKey(channelKey: LBBChannelKey): Promise<LBBChannel> {
    return ChannelService
      .findChannelByKey(channelKey)
      .catch(handleAPIError);
  }

  async fetchChannelsOnlyKeys(): Promise<LBBChannelKey[]> {
    return ChannelService
      .fetchOnlyKeys()
      .catch(handleAPIError);
  }

  async refreshChannel(id: number): Promise<boolean> {
    return ChannelService
      .refresh(id)
      .catch(handleAPIError);
  }

  async clearChannel(id: number): Promise<boolean> {
    return ChannelService
      .clear(id)
      .catch(handleAPIError);
  }

  async bulkAddUsersToChannel(
    channelId: number, usernames: string[],
  ): Promise<LBBUsernameResponse[]> {
    return ChannelService
      .bulkAddUsers(channelId, usernames)
      .catch(handleAPIError);
  }

  async findUserInChannel(
    channelId: number, username: string,
  ): Promise<LBBUser> {
    return ChannelService
      .findUser(channelId, username)
      .catch(handleAPIError);
  }

  async deleteUserFromChannelByUsername(
    channelId: number, username: string,
  ): Promise<LBBUsernameResponse> {
    return ChannelService
      .deleteUser(channelId, username)
      .catch(handleAPIError);
  }

  async fetchUsersForChannel(
    channelId: number, sortBy = '-solved',
  ): Promise<LBBUser[]> {
    return ChannelService
      .fetchUsers(channelId, sortBy)
      .catch(handleAPIError);
  }

  async userCountForChannel(channelId: number): Promise<number> {
    return ChannelService
      .userCount(channelId)
      .catch(handleAPIError);
  }

  // ---------------------------------------------------------------------------
  // Channel User
  // ---------------------------------------------------------------------------

  async createChannelUser(
    channelUser: LBBChannelUser,
  ): Promise<LBBChannelUser> {
    return ChannelUserService
      .create(channelUser)
      .catch(handleAPIError);
  }

  async getChannelUser(id: number): Promise<LBBChannelUser> {
    return ChannelUserService
      .get(id)
      .catch(handleAPIError);
  }

  async fetchChannelUsers(): Promise<LBBChannelUser[]> {
    return ChannelUserService
      .fetch()
      .catch(handleAPIError);
  }

  async updateChannelUser(
    id: number, channelUser: LBBChannelUser,
  ): Promise<LBBChannelUser> {
    return ChannelUserService
      .update(id, channelUser)
      .catch(handleAPIError);
  }

  async deleteChannelUser(id: number): Promise<boolean> {
    return ChannelUserService
      .delete(id)
      .catch(handleAPIError);
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

  deleteSubscriptionByType(
    type: SubscriptionType, channelId: number,
  ): Promise<boolean> {
    return SubscriptionService.deleteByType(type, channelId);
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

  // ---------------------------------------------------------------------------
  // Contest
  // ---------------------------------------------------------------------------

  fetchClosestContests(): Promise<KontestContest[]> {
    return ContestService.fetchClosest();
  }
}

export default new ApiService();
