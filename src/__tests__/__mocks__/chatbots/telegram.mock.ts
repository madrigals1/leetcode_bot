import TelegramBot from 'node-telegram-bot-api';

import { Options } from '../../../chatbots/models';

class MockBotTelegram {
  chatId: number = null;

  photoUrl: string = null;

  options: Options = {};

  message: string = null;

  constructor() {
    this.nullify();
  }

  async sendPhoto(
    chatId: number, photoUrl: string, options: Options,
  ): Promise<TelegramBot.Message> {
    this.chatId = chatId;
    this.photoUrl = photoUrl;
    this.options = options;

    return {
      message_id: 1,
      date: 12312321,
      chat: {
        id: 1,
        type: 'private',
      },
      text: '',
    };
  }

  async sendMessage(
    chatId: number, message: string, options: Options,
  ): Promise<TelegramBot.Message> {
    this.chatId = chatId;
    this.message = message;
    this.options = options;

    return {
      message_id: 1,
      date: 12312321,
      chat: {
        id: 1,
        type: 'private',
      },
      text: message,
    };
  }

  nullify(): void {
    this.chatId = null;
    this.photoUrl = null;
    this.message = null;
    this.options = null;
  }
}

export default MockBotTelegram;
