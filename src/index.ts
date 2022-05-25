import { startRest } from './rest';
import Telegram from './chatbots/telegram';
import Discord from './chatbots/discord';
import Slack from './chatbots/slack';
import Cache from './backend/cache';
import { constants } from './globals/constants';
import { log } from './utils/helper';

Cache.preload()
  .then(() => {
    // Run Telegram BOT
    if (constants.PROVIDERS.TELEGRAM.ENABLE) new Telegram().run();

    // Run Discord BOT
    if (constants.PROVIDERS.DISCORD.ENABLE) Discord.run();

    // Run Slack BOT
    if (constants.PROVIDERS.SLACK.ENABLE) Slack.run();
  })
  .catch((err) => {
    log(err);
  });

startRest();
