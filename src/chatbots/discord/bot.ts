import { Client, GatewayIntentBits } from 'discord.js';

import { log } from '../../utils/helper';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';

const createBot = async (token: string): Promise<Client> => {
  // Create bot and use Token to Login
  const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
  await bot.login(token);

  log(SM.DISCORD_BOT_IS_CONNECTED);

  return bot;
};

export default createBot;
