import { Context } from '../models';

// eslint-disable-next-line import/prefer-default-export
export function reply(message: string, context: Context): Promise<string> {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  // Update options with Telegram specific data

  const replyMarkupOptions = options.buttons
    ? {
      reply_markup: options.buttons,
    }
    : {};

  const parseModeOptions = options.parseMode
    ? {
      parse_mode: options.parseMode,
    }
    : {};

  const updatedOptions = {
    ...options,
    ...replyMarkupOptions,
    ...parseModeOptions,
  };

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, updatedOptions);
}
