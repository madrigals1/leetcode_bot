const { DISCORD } = require('../utils/constants');
const { log } = require('../utils/helper');

const bot = require('./bot');
const listeners = require('./listeners');

const run = () => {
  bot.on('message', (message) => {
    const { content, author } = message;

    if (!content.startsWith(DISCORD.PREFIX) || author.bot) return;

    let args = content.slice(DISCORD.PREFIX.length).trim().split(' ');
    const command = args[0];

    args = args.splice(1);

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      for (let j = 0; j < listener.types.length; j++) {
        if (listener.types[j] === command) {
          listener.callback(message, args);
          return;
        }
      }
    }
  });

  log('>>> Discord BOT is running!');
};

module.exports = { run };
