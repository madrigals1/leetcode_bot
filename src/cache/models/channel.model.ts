import { ChatbotProvider } from '../../chatbots/models';
import { User as LeetcodeUser } from '../../leetcode/models';

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
  data?: LeetcodeUser;
}

export interface ChannelUser {
  id?: number;
  channelId: number;
  userId: number;
}
