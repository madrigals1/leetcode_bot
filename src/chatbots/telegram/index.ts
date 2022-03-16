/* eslint-disable import/first */
process.env.NTBA_FIX_319 = '1';

import * as TelegramBot from 'node-telegram-bot-api';

import { log } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import { constants } from '../../utils/constants';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { Options, Context } from '../models';
import { getPositionalParsedArguments } from '../decorators/utils';

import { reply } from './utils';

export default class Telegram {
  token: string = constants.PROVIDERS.TELEGRAM.TOKEN;

  options: Options = { polling: true };

  bot: TelegramBot;

  id = constants.PROVIDERS.TELEGRAM.ID;

  static getActionRegex(actionName: string): RegExp {
    return new RegExp(`^(/${actionName}|/${actionName} [a-zA-Z0-9_ ]+)$`);
  }

  getContext(
    message: TelegramBot.Message, userId: number, text: string = null,
  ): Context {
    const textCorrect = text || message.text;
    const chatId = message.chat.id;

    return {
      text: textCorrect,
      reply,
      argumentParser: getPositionalParsedArguments,
      provider: this.id,
      chatId: message.chat.id,
      prefix: constants.PROVIDERS.TELEGRAM.PREFIX,
      options: { parse_mode: 'HTML' },
      channelKey: {
        chatId: message.chat.id.toString(),
        provider: this.id,
      },
      isAdmin: new Promise((resolve) => {
        const isLocalChat = message.chat.id === userId;
        if (isLocalChat) resolve(true);

        this.bot
          .getChatAdministrators(chatId)
          .then((admins) => {
            const isChatAdmin = admins.map((m) => m.user.id).includes(userId);
            resolve(isChatAdmin);
          })
          .catch(() => resolve(false));
      }),
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
      const actionNameRegex = Telegram.getActionRegex(name);

      this.bot.onText(actionNameRegex, (message) => {
        // If action is send from User, send typing indicator
        if (message.chat) {
          this.bot
            .sendChatAction(message.chat.id, constants.CHAT_STATUS.TYPING)
            .catch((err) => log(err));
        }

        // Create context for message
        const context: Context = this.getContext(message, message.from.id);

        Actions[property](context);
      });
    });

    // Set specific callback_query and polling_error
    this.bot.on('polling_error', (err: Error) => log(err));

    // Handle button clicks
    this.bot.on('callback_query', (query) => {
      const { message, data, from } = query;

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
        const actionNameRegex = Telegram.getActionRegex(name);

        // If message starts with /rating, call rating action
        if (data.match(actionNameRegex)) {
          // Create context for message
          const context: Context = this.getContext(message, from.id, data);

          Actions[property](context);
        }
      }

      return null;
    });

    log(SM.TELEGRAM_BOT_IS_RUNNING);
  }
}
