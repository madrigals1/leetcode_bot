/* eslint-disable camelcase */
export interface User {
  id: number;
  username: string;
  data?: string;
}

export interface Channel {
  id: number;
  chat_id: string;
  provider: number;
  user_limit: number;
}

export interface ChannelUser {
  id: number;
  channel_id: number;
  username: string;
}
