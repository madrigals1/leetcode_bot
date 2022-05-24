import { constants } from '../utils/constants';
import { LBBSubscription } from '../backend/models';

import { SubscriptionType } from './models';

export interface FullSubscriptionTypeModel {
  subscriptionType: SubscriptionType;
  key: string;
  humanName: string;
  backendKey: string;
}

class SubscriptionTypeManager {
  private subscriptionsBySubscriptionType = (
    new Map<SubscriptionType, FullSubscriptionTypeModel>()
  );

  private subscriptionsByKey = (
    new Map<string, FullSubscriptionTypeModel>()
  );

  private subscriptionsByBackendKey = (
    new Map<string, FullSubscriptionTypeModel>()
  );

  constructor() {
    const dailyKey = 'daily';
    const contestKey = 'contest';

    const backendDailyKey = '01_daily_stats';
    const backendContestKey = '02_contest';

    const dailySubscription = {
      subscriptionType: SubscriptionType.DailyStats,
      key: dailyKey,
      humanName: 'Daily Stats',
      backendKey: backendDailyKey,
    };
    const contestSubscription = {
      subscriptionType: SubscriptionType.Contest,
      key: contestKey,
      humanName: 'Contest',
      backendKey: backendContestKey,
    };

    this.subscriptionsBySubscriptionType
      .set(SubscriptionType.DailyStats, dailySubscription);
    this.subscriptionsBySubscriptionType
      .set(SubscriptionType.Contest, contestSubscription);

    this.subscriptionsByKey.set(dailyKey, dailySubscription);
    this.subscriptionsByKey.set(contestKey, contestSubscription);

    this.subscriptionsByBackendKey
      .set(backendDailyKey, dailySubscription);
    this.subscriptionsByBackendKey
      .set(backendContestKey, contestSubscription);
  }

  getHumanName(key: SubscriptionType | string): string {
    if (typeof key === 'string') {
      return this.subscriptionsByKey.get(key)?.humanName;
    }

    return this.subscriptionsBySubscriptionType.get(key)?.humanName;
  }

  getByType(subscriptionType: SubscriptionType): FullSubscriptionTypeModel {
    return this.subscriptionsBySubscriptionType.get(subscriptionType);
  }

  getByKey(key: string): FullSubscriptionTypeModel {
    return this.subscriptionsByKey.get(key);
  }

  getByBackendKey(key: string): FullSubscriptionTypeModel {
    return this.subscriptionsByBackendKey.get(key);
  }

  getAll(): FullSubscriptionTypeModel[] {
    return [...this.subscriptionsBySubscriptionType.values()];
  }

  getSubscriptionsText(subscriptions: LBBSubscription[]): string {
    const allSubscriptionTypes = this.getAll();
    const subscriptionTypesForSubscriptions = subscriptions
      .map((subscription: LBBSubscription) => subscription.type);

    return allSubscriptionTypes
      .map((fsub: FullSubscriptionTypeModel) => {
        const contains = (
          subscriptionTypesForSubscriptions.includes(fsub.subscriptionType)
        );

        return contains
          ? `${fsub.humanName} - ${constants.EMOJI.SUCCESS}`
          : `${fsub.humanName} - ${constants.EMOJI.CROSS_MARK}`;
      }).join('\n');
  }
}

export default new SubscriptionTypeManager();
