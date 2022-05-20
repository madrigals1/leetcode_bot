import { SubscriptionType } from './models';

interface FullSubscriptionModel {
  subscriptionType: SubscriptionType;
  key: string;
  humanName: string;
}

class SubscriptionTypeManager {
  private subscriptionsBySubscriptionType = (
    new Map<SubscriptionType, FullSubscriptionModel>()
  );

  private subscriptionsByKey = (
    new Map<string, FullSubscriptionModel>()
  );

  constructor() {
    const dailyKey = 'daily';
    const contestKey = 'contest';

    const dailySubscription = {
      subscriptionType: SubscriptionType.DailyStats,
      key: dailyKey,
      humanName: 'Daily Stats',
    };
    const contestSubscription = {
      subscriptionType: SubscriptionType.Contest,
      key: contestKey,
      humanName: 'Contest',
    };

    this.subscriptionsBySubscriptionType
      .set(SubscriptionType.DailyStats, dailySubscription);
    this.subscriptionsBySubscriptionType
      .set(SubscriptionType.Contest, contestSubscription);

    this.subscriptionsByKey.set(dailyKey, dailySubscription);
    this.subscriptionsByKey.set(contestKey, contestSubscription);
  }

  getHumanName(key: SubscriptionType | string): string {
    if (typeof key === 'string') {
      return this.subscriptionsByKey.get(key)?.humanName;
    }

    return this.subscriptionsBySubscriptionType.get(key)?.humanName;
  }

  getKey(subscriptionType: SubscriptionType): string {
    return this.subscriptionsBySubscriptionType.get(subscriptionType)?.key;
  }

  getType(key: string): SubscriptionType {
    return this.subscriptionsByKey.get(key)?.subscriptionType;
  }
}

export default new SubscriptionTypeManager();
