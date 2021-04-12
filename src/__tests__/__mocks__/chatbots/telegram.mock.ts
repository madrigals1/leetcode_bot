import { Options } from '../../../chatbots/models';

class MockBotTelegram {
  chatId: number = null;

  photoUrl: string = null;

  options: Options = {};

  message: string = null;

  constructor() {
    this.nullify();
  }

  sendPhoto(chatId: number, photoUrl: string, options: Options): void {
    this.chatId = chatId;
    this.photoUrl = photoUrl;
    this.options = options;
  }

  sendMessage(chatId: number, message: string, options: Options): void {
    this.chatId = chatId;
    this.message = message;
    this.options = options;
  }

  nullify(): void {
    this.chatId = null;
    this.photoUrl = null;
    this.message = null;
    this.options = null;
  }
}

export default MockBotTelegram;
