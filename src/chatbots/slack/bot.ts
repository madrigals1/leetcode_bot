import { App } from '@slack/bolt';

import { log } from '../../utils/helper';
import { dictionary } from '../../utils/dictionary';

const { SERVER_MESSAGES: SM } = dictionary;

const createBot = async (
  token: string, signingSecret: string, appToken: string,
): Promise<App> => {
  const bot = new App({
    token, appToken, signingSecret, socketMode: true,
  });

  log(SM.SLACK_BOT_IS_CONNECTED);

  return bot;
};

export default createBot;
