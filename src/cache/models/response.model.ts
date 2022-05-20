import { Subscription } from '../../chatbots/models';
import { User } from '../../leetcode/models';

export interface CacheResponse {
  status: string;
  detail: string;
}

export interface UserCacheResponse extends CacheResponse {
  user?: User;
}

export interface SubscriptionCacheResponse extends CacheResponse {
  subscription?: Subscription;
}
