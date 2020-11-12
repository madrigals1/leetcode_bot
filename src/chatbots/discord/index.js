const { DISCORD } = require('../../utils/constants');
const { log } = require('../../utils/helper');
const { actions } = require('../actions');

const { createBot } = require('./bot');
const { reply } = require('./utils');

class Discord {
  constructor() {
    // Save token
    this.token = DISCORD.TOKEN;
  }

  run() {
    // Create Bot with token
    this.bot = createBot(this.token);

    // Set Bot message listener (any message)
    this.bot.on('message', (message) => {
      const { content, author, channel } = message;

      // If message doesn't start with ! (prefix) OR author is BOT, then ignore
      if (!content.startsWith(DISCORD.PREFIX) || author.bot) return;

      // Turn "!rating username arg1" into ["!rating", "username", "arg1"]
      let args = content.slice(DISCORD.PREFIX.length).trim().split(' ');

      // Get command and arguments from args list
      const command = args[0];
      args = args.splice(1);

      // Find appropriate action by name and execute it
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.name === command) {
          const context = {
            channel,
            provider: DISCORD.NAME,
            prefix: DISCORD.PREFIX,
            options: {},
          };
          channel.startTyping().then();
          action.execute(args, reply, context);
          channel.stopTyping();

          // Stop searching after action is found
          return;
        }
      }
    });

    log('>>> Discord BOT is running!');
  }
}

module.exports = new Discord();
