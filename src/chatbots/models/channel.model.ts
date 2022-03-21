export interface User {
  id: number;
  username: string;
  data?: string;
}

export interface Channel {
  id: number;
  chatId: string;
  provider: number;
  userLimit: number;
}

export interface ChannelUser {
  id: number;
  channelId: number;
  username: string;
}
