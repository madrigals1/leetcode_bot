import { User } from '../../leetcode/models';

export interface CacheResponse {
  status: string;
  detail: string;
}

export interface UserCacheResponse extends CacheResponse {
  user?: User;
}
