import { Context } from '../../chatbots/models';

export interface TelegramTestCase {
  message: string;
  context: Context;
  expected: {
    chatId: number;
    photoUrl: string;
    message: string;
    options: {
      captions?: string;
    };
  }
}

export interface Args {
  message: string;
  expectedArgs: string[];
}

export interface DiscordTestCase {
  message: string;
  context: Context;
  expected: string | Error;
  expectedMessage: string;
  expectedOptions: {
    files?: string[];
  };
}
