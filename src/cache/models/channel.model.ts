import { ChatbotProvider } from '../../chatbots';

export interface IChannel {
  id: number;
  chatId: string;
  provider: ChatbotProvider;
  userLimit: number;
}
