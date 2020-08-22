const listeners = require('./listeners');
const Listener = require('./listener');
const bot = require('./bot');
const { log } = require('../utils/helper');

const run = () => {
  listeners.forEach((listener) => {
    new Listener(listener.actionType, listener.types, listener.callback).init(bot);
  });

  log('>>> Telegram BOT is running!');
};

module.exports = { run };
