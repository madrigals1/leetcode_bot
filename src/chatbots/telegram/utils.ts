import { Context } from '../models';

// eslint-disable-next-line import/prefer-default-export
export function reply(message: string, context: Context): void {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, options);
}
