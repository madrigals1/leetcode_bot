import {
  ChannelService, ChannelUserService, SubscriptionService, UserService,
} from './services';

export class ApiService {
  // ---------------------------------------------------------------------------
  // Channel
  // ---------------------------------------------------------------------------

  static createChannel = ChannelService.create;

  static getChannel = ChannelService.get;

  static fetchChannels = ChannelService.fetch;

  static updateChannel = ChannelService.update;

  static deleteChannel = ChannelService.delete;

  static findChannelByKey = ChannelService.findChannelByKey;

  // ---------------------------------------------------------------------------
  // Channel User
  // ---------------------------------------------------------------------------

  static createChannelUser = ChannelUserService.create;

  static getChannelUser = ChannelUserService.get;

  static fetchChannelUsers = ChannelUserService.fetch;

  static updateChannelUser = ChannelUserService.update;

  static deleteChannelUser = ChannelUserService.delete;

  // ---------------------------------------------------------------------------
  // Subscription
  // ---------------------------------------------------------------------------

  static createSubscription = SubscriptionService.create;

  static getSubscription = SubscriptionService.get;

  static fetchSubscriptions = SubscriptionService.fetch;

  static updateSubscription = SubscriptionService.update;

  static deleteSubscription = SubscriptionService.delete;

  // ---------------------------------------------------------------------------
  // User
  // ---------------------------------------------------------------------------

  static createUser = UserService.create;

  static getUser = UserService.get;

  static fetchUsers = UserService.fetch;

  static updateUser = UserService.update;

  static deleteUser = UserService.delete;
}
