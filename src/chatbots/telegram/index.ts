/* eslint-disable import/first */
process.env.NTBA_FIX_319 = '1';

import * as TelegramBot from 'node-telegram-bot-api';

import { log } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { Options, Context, TelegramMessage } from '../models';
import { getPositionalParsedArguments } from '../decorators/utils';

import { reply } from './utils';

const { SERVER_MESSAGES: SM } = dictionary;

export default class Telegram {
  token: string = constants.PROVIDERS.TELEGRAM.TOKEN;

  options: Options = { polling: true };

  bot: TelegramBot;

  id = constants.PROVIDERS.TELEGRAM.ID;

  getContext(message: TelegramMessage, text: string = null): Context {
    const textCorrect = text || message.text;

    return {
      text: textCorrect,
      reply,
      argumentParser: getPositionalParsedArguments,
      provider: this.id,
      chatId: message.chat.id,
      prefix: constants.PROVIDERS.TELEGRAM.PREFIX,
      options: { parseMode: 'HTML' },
      bot: this.bot,
    };
  }

  run(): void {
    // Start the bot
    this.bot = new TelegramBot(this.token, this.options);

    // Log that Telegram BOT is connected
    log(SM.TELEGRAM_BOT_IS_CONNECTED);

    // Add regular actions
    registeredActions.forEach(({ name, property }) => {
      // convert regular string to regexp
      const actionNameRegex = new RegExp(name);

      this.bot.onText(actionNameRegex, (message) => {
        // If action is send from User, send typing indicator
        if (message.chat) {
          this.bot
            .sendChatAction(message.chat.id, constants.CHAT_STATUS.TYPING)
            .then();
        }

        // Create context for message
        const context: Context = this.getContext(message);

        Actions[property](context);
      });
    });

    // Set specific callback_query and polling_error
    this.bot.on('polling_error', (err: Error) => log(err));

    // Handle button clicks
    this.bot.on('callback_query', (query) => {
      const { message, data } = query;

      // Delete all buttons after button is clicked
      this.bot.answerCallbackQuery(query.id)
        .then(() => {
          this.bot.editMessageReplyMarkup(
            { inline_keyboard: [] },
            {
              chat_id: message.chat.id,
              message_id: message.message_id,
            },
          );
        });

      // Check if callback data is a command
      for (let i = 0; i < registeredActions.length; i++) {
        const { name, property } = registeredActions[i];

        // If message starts with /rating, call rating action
        if (data.match(name)) {
          // Create context for message
          const context: Context = this.getContext(message, data);

          Actions[property](context);
        }
      }

      return null;
    });

    log(SM.TELEGRAM_BOT_IS_RUNNING);
  }
}
