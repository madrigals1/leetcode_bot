import { Client, GatewayIntentBits } from 'discord.js';

import { log } from '../../utils/helper';
import { ProviderMessages } from '../../global/messages';

const createBot = async (token: string): Promise<Client> => {
  // Create bot and use Token to Login
  const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
  await bot.login(token);

  log(ProviderMessages.discordBotIsConnected);

  return bot;
};

export default createBot;
