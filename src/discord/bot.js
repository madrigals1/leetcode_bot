const DiscordBot = require('discord.js');

const { DISCORD_TOKEN } = require('../utils/constants');

const bot = new DiscordBot.Client();

bot.login(DISCORD_TOKEN);

module.exports = bot;
