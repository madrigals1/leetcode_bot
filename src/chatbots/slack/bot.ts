import SlackBot from 'slackbots';

import { log } from '../../utils/helper';
import dictionary from '../../utils/dictionary';

const createBot = async (token: string): Promise<SlackBot.Client> => {
  const bot = new SlackBot({
    token,
    name: 'LeetCode BOT',
  });

  log(dictionary.SERVER_MESSAGES.SLACK_BOT_IS_CONNECTED);

  return bot;
};

export default createBot;
