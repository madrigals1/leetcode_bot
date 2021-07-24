import { App } from '@slack/bolt';

import Actions, { registeredActions } from '../actions';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { error, log } from '../../utils/helper';
import { Context } from '../models';

import { getArgs, reply } from './utils';
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

    // Add regular actions
    registeredActions.forEach(({ name, property }) => {
      this.bot.command(name, async ({ command, ack, say }) => {
        // Get args from message
        const args: string[] = getArgs(command.text);

        // Create context for message
        const context: Context = {
          text: command.text,
          args,
          reply,
          channel: {
            send: say,
          },
          provider: constants.SLACK.NAME,
          prefix: constants.SLACK.PREFIX,
          options: {},
        };

        await ack();

        Actions[property](context);
      });
    });

    // Home page
    this.bot.event('app_home_opened', async ({ event, client }) => {
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
