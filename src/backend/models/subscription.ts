import { SubscriptionType } from '../../chatbots/models';

export interface LBBSubscription {
  id?: number;
  url?: string;
  channel_id: number;
  type: SubscriptionType;
  created_at?: string;
  updated_at?: string;
}
