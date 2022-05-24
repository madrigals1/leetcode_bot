import { ChatbotProvider } from '../../chatbots';

export interface ChannelKey {
  id?: number;
  chatId: string;
  provider: ChatbotProvider;
}

export interface Channel {
  id?: number;
  key: ChannelKey;
  userLimit?: number;
}

export interface User {
  id?: number;
  username: string;
  data?: string;
}

export interface ChannelUser {
  id?: number;
  channelId: number;
  username: string;
}
