const DiscordBot = require('discord.js');

const { log } = require('../../utils/helper');
const { DISCORD_TOKEN } = require('../../utils/constants');

// Create bot and use Token to Login
const bot = new DiscordBot.Client();
bot.login(DISCORD_TOKEN).then(() => log('>>> Discord BOT is connected!'));

module.exports = bot;
