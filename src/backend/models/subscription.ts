import { SubscriptionType } from '../../chatbots/models';

export interface LBBSubscription {
  id?: number;
  url?: string;
  channel: number;
  type: SubscriptionType;
  created_at?: string;
  updated_at?: string;
}
