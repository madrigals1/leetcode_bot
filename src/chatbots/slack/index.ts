import * as SlackBot from 'slackbots';

import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { log } from '../../utils/helper';

import createBot from './bot';

class Slack {
  token: string = constants.SLACK.TOKEN;

  bot: SlackBot.Client;

  async run() {
    // Create Bot with token
    this.bot = await createBot(this.token);

    this.bot.on('start', () => {
      const params = {
        icon_emoji: ':robot_face:',
      };

      this.bot.postMessageToChannel(
        'Hello',
        'LeetCode BOT is working correctly!',
        params,
      );
    });

    log(dictionary.SERVER_MESSAGES.SLACK_BOT_IS_RUNNING);
  }
}

export default new Slack();
