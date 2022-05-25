import * as TelegramBot from 'node-telegram-bot-api';

import { log } from '../../utils/helper';
import { ErrorMessages, SmallMessages } from '../../globals/messages';
import MockBotTelegram from '../../__tests__/__mocks__/chatbots/telegram.mock';
import { Context, ButtonContainer } from '../models';

export function getReplyMarkupFromButtons(
  buttonContainers: ButtonContainer[],
): TelegramBot.InlineKeyboardMarkup {
  const keyboard = [];

  buttonContainers.forEach((buttonContainer) => {
    const { buttons, buttonPerRow } = buttonContainer;

    for (let i = 0; i < Math.ceil(buttons.length / buttonPerRow); i++) {
      const row: TelegramBot.InlineKeyboardButton[] = [];

      for (let j = 0; j < buttonPerRow; j++) {
        const index = (i * buttonPerRow) + j;

        if (index < buttons.length) {
          const button = buttons[index];
          const keyboardButton: TelegramBot.InlineKeyboardButton = {
            text: button.text, callback_data: button.action,
          };
          row.push(keyboardButton);
        }
      }

      keyboard.push(row);
    }
  });

  return { inline_keyboard: keyboard };
}

export async function reply(
  message: string, context: Context,
): Promise<string> {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  if (!(bot instanceof TelegramBot) && !(bot instanceof MockBotTelegram)) {
    log(SmallMessages.incorrectBotType);
    return ErrorMessages.server;
  }

  const replyMarkupOptions = options.buttons
    ? { reply_markup: getReplyMarkupFromButtons(options.buttons) }
    : {};

  // Update options with Telegram specific data
  const updatedOptions = { ...options, ...replyMarkupOptions };

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { caption: message })
      .then((res) => res.text)
      .catch((err) => {
        log(err);
        return ErrorMessages.server;
      });
  }

  return bot.sendMessage(chatId, message, updatedOptions)
    .then((res) => res.text)
    .catch((err) => {
      log(err);
      return ErrorMessages.server;
    });
}
