import { Context } from '../models';

export function reply(message: string, context: Context) {
  const {
    chatId, options, bot, photoUrl,
  } = context;

  if (photoUrl) {
    return bot.sendPhoto(chatId, photoUrl, { captions: message });
  }

  return bot.sendMessage(chatId, message, options);
}

export function getArgs(message: string): string[] {
  // Get all args from message
  const args = message.trim().split(' ');

  // Remove action name
  args.shift();

  return args;
}
