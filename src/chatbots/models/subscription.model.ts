import { ChannelKey } from '../../cache/models';

export enum SubscriptionType {
  DailyStats = 1,
  Contest,
}

export interface Subscription {
  id?: number;
  channelKey: ChannelKey;
  subscriptionType: SubscriptionType;
}
