import { ChatbotProvider } from '../../chatbots';
import { User } from '../../leetcode/models';

export interface IChannel {
  id: number;
  chatId: string;
  provider: ChatbotProvider;
  userLimit: number;
  users: User[];
}
