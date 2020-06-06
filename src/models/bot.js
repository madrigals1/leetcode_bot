const TeleBot = require('telebot');
const { TELEGRAM_TOKEN } = require('../utils/constants');

module.exports = new TeleBot(TELEGRAM_TOKEN);
