/* eslint-disable import/first */
process.env.NTBA_FIX_319 = '1';

import * as TelegramBot from 'node-telegram-bot-api';

import { log } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { Options, Context } from '../models';

import { reply } from './utils';

class Telegram {
  token: string = constants.TELEGRAM.TOKEN;

  options: Options = { polling: true };

  bot: TelegramBot;

  getContext(message, text: string = null): Context {
    const textCorrect = text || message.text;

    return {
      text: textCorrect,
      reply,
      provider: constants.TELEGRAM.NAME,
      chatId: message.chat.id,
      prefix: constants.TELEGRAM.PREFIX,
      options: { parse_mode: 'HTML' },
      bot: this.bot,
    };
  }

  run() {
    // Start the bot
    this.bot = new TelegramBot(this.token, this.options);

    // Log that Telegram BOT is connected
    log(dictionary.SERVER_MESSAGES.TELEGRAM_BOT_IS_CONNECTED);

    // Add regular actions
    registeredActions.forEach(({ name, property }) => {
      // convert regular string to regexp
      const actionNameRegex = new RegExp(name);

      this.bot.onText(actionNameRegex, (message) => {
        // If action is send from User, send typing indicator
        if (message.chat) {
          this.bot
            .sendChatAction(message.chat.id, constants.STATUS.TYPING)
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

    log(dictionary.SERVER_MESSAGES.TELEGRAM_BOT_IS_RUNNING);
  }
}

export default new Telegram();
