import { SubscriptionType } from './models';

interface FullSubscriptionModel {
  subscriptionType: SubscriptionType;
  key: string;
  humanName: string;
}

class SubscriptionTypeManager {
  subscriptions = new Map<SubscriptionType, FullSubscriptionModel>();

  constructor() {
    this.subscriptions.set(SubscriptionType.DailyStats, {
      subscriptionType: SubscriptionType.DailyStats,
      key: 'daily',
      humanName: 'Daily Stats',
    });

    this.subscriptions.set(SubscriptionType.Contest, {
      subscriptionType: SubscriptionType.Contest,
      key: 'contest',
      humanName: 'Contest',
    });
  }

  getHumanName(subscriptionType: SubscriptionType): string {
    return this.subscriptions.get(subscriptionType)?.humanName;
  }

  getKey(subscriptionType: SubscriptionType): string {
    return this.subscriptions.get(subscriptionType)?.key;
  }
}

export default new SubscriptionTypeManager();
