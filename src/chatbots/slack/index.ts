import { App } from '@slack/bolt';

import Actions, { registeredActions } from '../actions';
import { constants } from '../../utils/constants';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { error, log } from '../../utils/helper';
import { Context } from '../models';
import { getPositionalParsedArguments } from '../decorators/utils';

import { reply } from './utils';
import createBot from './bot';

class Slack {
  token: string = constants.PROVIDERS.SLACK.TOKEN;

  signingSecret: string = constants.PROVIDERS.SLACK.SIGNING_SECRET;

  appToken: string = constants.PROVIDERS.SLACK.APP_TOKEN;

  bot: App;

  id = constants.PROVIDERS.SLACK.ID;

  async run() {
    // Create Bot with Slack credentials
    this.bot = await createBot(this.token, this.signingSecret, this.appToken);

    await this.bot.start();

    // Add regular actions
    registeredActions.forEach(({ name, property }) => {
      this.bot.command(name, async ({ command, ack, say }) => {
        // Create context for message
        const context: Context = {
          text: command.text,
          reply,
          argumentParser: getPositionalParsedArguments,
          channel: {
            send: say,
          },
          channelKey: {
            chat_id: command.channel_id,
            provider: this.id,
          },
          provider: this.id,
          prefix: constants.PROVIDERS.SLACK.PREFIX,
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

    log(SM.SLACK_BOT_IS_RUNNING);
  }
}

export default new Slack();
