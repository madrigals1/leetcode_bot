import { App } from '@slack/bolt';

import { ProviderMessages } from '../../global/messages';
import { log } from '../../utils/helper';

const createBot = async (
  token: string,
  signingSecret: string,
  appToken: string,
): Promise<App> => {
  const bot = new App({
    token, appToken, signingSecret, socketMode: true,
  });

  log(ProviderMessages.slackBotIsRunning);

  return bot;
};

export default createBot;
