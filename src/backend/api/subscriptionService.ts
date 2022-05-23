import { LBBSubscription } from '../models';

import { Service } from './requests';

class SubscriptionService extends Service<LBBSubscription> {
  constructor() {
    super('/subscriptions');
  }
}

export default new SubscriptionService();
