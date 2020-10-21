process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { TELEGRAM } = require('../../utils/constants');

module.exports = new TelegramBot(TELEGRAM.TOKEN, { polling: true });
