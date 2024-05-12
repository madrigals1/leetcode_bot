import TelegramBot from 'node-telegram-bot-api';

import { ChatbotProvider } from './provider.model';

export interface Context {
  text: string;
  provider: ChatbotProvider;
  reply: (message: string, context: Context) => Promise<string>;
  telegram: {
    bot?: TelegramBot;
    chatId?: TelegramBot.ChatId;
  };
}
