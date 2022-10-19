import { Client, Intents } from 'discord.js';

import { log } from '../../utils/helper';
import { ProviderMessages } from '../../globals/messages';

const createBot = async (token: string): Promise<Client> => {
  // Create bot and use Token to Login
  const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
  await bot.login(token);

  log(ProviderMessages.discordBotIsConnected);

  return bot;
};

export default createBot;
