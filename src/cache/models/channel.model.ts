import { ChatbotProvider } from '../../chatbots';

export interface ChannelKey {
  chatId: string;
  provider: ChatbotProvider;
}

export interface ChannelData {
  id?: number;
  key: ChannelKey;
}

export interface ChannelUser {
  channelId: number;
  username: string;
}
