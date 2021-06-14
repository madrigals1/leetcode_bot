import { App } from '@slack/bolt';

import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { error, log } from '../../utils/helper';

import createBot from './bot';

class Slack {
  token: string = constants.SLACK.TOKEN;

  signingSecret: string = constants.SLACK.SIGNING_SECRET;

  appToken: string = constants.SLACK.APP_TOKEN;

  bot: App;

  async run() {
    // Create Bot with Slack credentials
    this.bot = await createBot(this.token, this.signingSecret, this.appToken);

    await this.bot.start();

    // Home page
    this.bot.event('app_home_opened', async ({ event, client, context }) => {
      try {
        client.views.publish({
          user_id: event.user,
          view: {
            type: 'home',
            callback_id: 'home_view',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '*Welcome to _LeetCode BOT_* :robot_face:',
                },
              },
            ],
          },
        });
      } catch (err) {
        error(err);
      }
    });

    log(dictionary.SERVER_MESSAGES.SLACK_BOT_IS_RUNNING);
  }
}

export default new Slack();
