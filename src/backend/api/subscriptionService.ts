import { SubscriptionType } from '../../chatbots/models';
import { LBBSubscription } from '../models';

import { Requests, Service } from './requests';

class SubscriptionService extends Service<LBBSubscription> {
  subscriptionTypeMap = new Map<SubscriptionType, string>();

  constructor() {
    super('/subscriptions');
    this.subscriptionTypeMap.set(SubscriptionType.DailyStats, '01_daily_stats');
    this.subscriptionTypeMap.set(SubscriptionType.Contest, '02_contest');
  }

  async deleteByType(
    type: SubscriptionType, channelId: number,
  ): Promise<boolean> {
    return Requests
      .post(`${this.url}/delete/`, { type, channel: channelId })
      .then(() => true)
      .catch(() => false);
  }
}

export default new SubscriptionService();
