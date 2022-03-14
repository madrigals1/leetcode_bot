/* eslint-disable camelcase */
import TelegramBot from 'node-telegram-bot-api';

import { Context, Options } from '.';

export interface TelegramTestCase {
  name: string;
  message: string;
  context: Context;
  expected: {
    chatId: number;
    photoUrl: string;
    message: string;
    options: {
      captions?: string;
      reply_markup?: TelegramBot.InlineKeyboardMarkup;
    };
  };
}

export interface DiscordTestCase {
  message: string;
  context: Context;
  expected: string | Error;
  expectedMessage: string;
  expectedOptions: Options;
}
