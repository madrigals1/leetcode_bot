import { Context } from '../models';

export async function reply(
  message: string,
  context: Context,
): Promise<string> {
  const { telegram } = context;

  return telegram.bot.sendMessage(telegram.chatId, message)
    .then((res) => res.text)
    .catch(() => '❗ Error on the server');
}
