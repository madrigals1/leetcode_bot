import { SubscriptionType } from '../../chatbots/models';
import { LBBSubscription } from '../models';

import { Service } from './requests';

class SubscriptionService extends Service<LBBSubscription> {
  subscriptionTypeMap = new Map<SubscriptionType, string>();

  constructor() {
    super('/subscriptions');
    this.subscriptionTypeMap.set(SubscriptionType.DailyStats, '01_daily_stats');
    this.subscriptionTypeMap.set(SubscriptionType.Contest, '02_contest');
  }
}

export default new SubscriptionService();
