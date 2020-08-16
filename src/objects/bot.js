process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN } = require('../utils/constants');

module.exports = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
