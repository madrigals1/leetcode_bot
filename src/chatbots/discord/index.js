import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { log } from '../../utils/helper';
import actions from '../actions';

import createBot from './bot';
import { reply } from './utils';

class Discord {
  constructor() {
    // Save token
    this.token = constants.DISCORD.TOKEN;
  }

  async run() {
    // Create Bot with token
    this.bot = await createBot(this.token);

    // Set Bot message listener (any message)
    this.bot.on('message', (message) => {
      const { content, author, channel } = message;

      // If message doesn't start with ! (prefix) OR author is BOT, then ignore
      if (!content.startsWith(constants.DISCORD.PREFIX) || author.bot) return;

      // Turn "!rating username arg1" into ["!rating", "username", "arg1"]
      let args = content
        .slice(constants.DISCORD.PREFIX.length)
        .trim()
        .split(' ');

      // Get command and arguments from args list
      const command = args[0];
      args = args.splice(1);

      // Find appropriate action by name and execute it
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.name === command) {
          const context = {
            args,
            reply,
            channel,
            provider: constants.DISCORD.NAME,
            prefix: constants.DISCORD.PREFIX,
            options: {},
          };
          channel.startTyping().then();
          action.execute(context);
          channel.stopTyping();

          // Stop searching after action is found
          return;
        }
      }
    });

    log(dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING);
  }
}

export default new Discord();
