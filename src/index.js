const Telegram = require('./chatbots/telegram');
const Discord = require('./chatbots/discord');
const startScheduler = require('./utils/scheduler');
const Database = require('./database');
const User = require('./cache/user');
const { TELEGRAM, DISCORD } = require('./utils/constants');

// Connecting to Database
Database.connect().then(() => {
  // Refreshing the users
  User.refresh()
    .then(() => {
      // Run Telegram BOT
      if (TELEGRAM.ENABLE) Telegram.run();

      // Run Discord BOT
      if (DISCORD.ENABLE) Discord.run();

      // Starting the scheduler for database refresher
      startScheduler();
    });
});
