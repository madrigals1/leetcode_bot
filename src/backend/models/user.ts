import { User } from '../../leetcode/models';

export interface LBBUser {
  id?: number;
  url?: string;
  username: string;
  solved?: number;
  solved_cml?: number;
  data?: User;
  created_at?: string;
  updated_at?: string;
}

export interface LBBUserOnlyUsername {
  id?: number;
  username: string;
}
