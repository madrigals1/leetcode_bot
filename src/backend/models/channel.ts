export interface LBBChannel {
  id?: number;
  url: string;
  chat_id: string;
  provider: number;
  user_limit: number;
  created_at?: string;
  updated_at?: string;
}

export interface LBBChannelUser {
  id?: number;
  url: string;
  channel_id: number;
  user: number;
  created_at?: string;
  updated_at?: string;
}

export interface LBBChannelKey {
  id?: number;
  chat_id: string;
  provider: number;
}
