import { startRest } from './rest';
import { startScheduler } from './scheduler';
import Telegram from './chatbots/telegram';
import Discord from './chatbots/discord';
import Slack from './chatbots/slack';
import refreshUsersCron from './utils/scheduler';
import Database from './database';
import Cache from './cache';
import { constants } from './global/constants';
import { delay, log } from './utils/helper';

Cache.preload()
  .then(() => {
    // Run Telegram BOT
    if (constants.PROVIDERS.TELEGRAM.ENABLE) Telegram.run();

    // Run Discord BOT
    if (constants.PROVIDERS.DISCORD.ENABLE) Discord.run();

    // Run Slack BOT
    if (constants.PROVIDERS.SLACK.ENABLE) Slack.run();
  })
  .catch((err) => {
    log(err);
  });

startRest();

// startScheduler();
