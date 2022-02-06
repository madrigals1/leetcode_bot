import { ChatbotProvider } from '../../chatbots';

export interface ChannelKey {
  chatId: string;
  provider: ChatbotProvider;
}

export interface ChannelData {
  id?: number;
  key: ChannelKey;
  userLimit: number;
}
