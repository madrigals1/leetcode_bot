const DiscordBot = require('discord.js');

const { log } = require('../../utils/helper');

const createBot = (token) => {
  // Create bot and use Token to Login
  const bot = new DiscordBot.Client();
  bot.login(token).then(() => log('>>> Discord BOT is connected!'));

  return bot;
};

module.exports = { createBot };
