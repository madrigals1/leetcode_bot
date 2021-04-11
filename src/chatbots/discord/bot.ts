import * as DiscordBot from 'discord.js';

import { log } from '../../utils/helper';
import dictionary from '../../utils/dictionary';

const createBot = async (token: string): Promise<DiscordBot.Client> => {
  // Create bot and use Token to Login
  const bot = new DiscordBot.Client();
  await bot.login(token);

  log(dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_CONNECTED);

  return bot;
};

export default createBot;
