import Telegram from './chatbots/telegram';
import Discord from './chatbots/discord';
import Slack from './chatbots/slack';
import startScheduler from './utils/scheduler';
import Database from './database';
import Cache from './cache';
import constants from './utils/constants';
import { delay } from './utils/helper';

// Connecting to Database
Database.connect().then(async () => {
  // Wait 1 second for Databases to initialize
  await delay(1000);

  // Refreshing the users
  Cache.refreshUsers()
    .then(() => {
      // Run Telegram BOT
      if (constants.TELEGRAM.ENABLE) Telegram.run();

      // Run Discord BOT
      if (constants.DISCORD.ENABLE) Discord.run();

      // Run Slack BOT
      if (constants.SLACK.ENABLE) Slack.run();

      // Starting the scheduler for database refresher
      startScheduler();
    });
});
