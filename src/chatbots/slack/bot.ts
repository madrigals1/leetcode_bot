import { App } from '@slack/bolt';

import { log } from '../../utils/helper';
import { ProviderMessages } from '../../utils/messageMaps';

const createBot = async (
  token: string, signingSecret: string, appToken: string,
): Promise<App> => {
  const bot = new App({
    token, appToken, signingSecret, socketMode: true,
  });

  log(ProviderMessages.slackBotIsConnected);

  return bot;
};

export default createBot;
