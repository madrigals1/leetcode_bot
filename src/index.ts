import { startRest } from './rest';
import Telegram from './chatbots/telegram';
import Discord from './chatbots/discord';
import Slack from './chatbots/slack';
import { refreshUsersCron } from './utils/scheduler';
import Cache from './backend/cache';
import { constants } from './utils/constants';
import { log } from './utils/helper';

Cache.preload()
  .then(() => {
    // Run Telegram BOT
    if (constants.PROVIDERS.TELEGRAM.ENABLE) new Telegram().run();

    // Run Discord BOT
    if (constants.PROVIDERS.DISCORD.ENABLE) Discord.run();

    // Run Slack BOT
    if (constants.PROVIDERS.SLACK.ENABLE) Slack.run();

    // Starting the scheduler for Cache refresher
    refreshUsersCron();
  })
  .catch((err) => {
    log(err);
  });

startRest();
