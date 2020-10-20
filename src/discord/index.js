const { DISCORD } = require('../utils/constants');
const { log } = require('../utils/helper');

const bot = require('./bot');
const listeners = require('./listeners');

const run = () => {
  // If bot receives any message
  bot.on('message', (message) => {
    const { content, author } = message;

    // If message doesn't start with ! (prefix) OR author is BOT, then ignore
    if (!content.startsWith(DISCORD.PREFIX) || author.bot) return;

    // Turn "!rating username arg1" into ["!rating", "username", "arg1"]
    let args = content.slice(DISCORD.PREFIX.length).trim().split(' ');

    // Get command and arguments from args list
    const command = args[0];
    args = args.splice(1);

    // Go through each listener and check, if it's command is correct and
    // execute it's callback
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      for (let j = 0; j < listener.types.length; j++) {
        // If we found a command that we need, execute it and stop the loop
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
