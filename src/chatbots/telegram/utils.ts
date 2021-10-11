import { Context } from '../models';

// eslint-disable-next-line import/prefer-default-export
export function reply(message: string, context: Context): Promise<string> {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  // Update options with Telegram specific data
  const updatedOptions = {
    ...options,
    reply_markup: options.buttons,
    parse_mode: options.parseMode,
  };

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, updatedOptions);
}
