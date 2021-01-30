import DiscordBot from 'discord.js';

import { log } from '../../utils/helper';

const createBot = (token) => {
  // Create bot and use Token to Login
  const bot = new DiscordBot.Client();
  bot.login(token).then(() => log('>>> Discord BOT is connected!'));

  return bot;
};

export default createBot;
