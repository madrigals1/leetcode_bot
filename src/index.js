const { listeners } = require('./models/system');
const bot = require('./models/bot');
const startScheduler = require('./utils/scheduler');
const Listener = require('./models/listener');
const { connect } = require('./models/database');
const { refresh } = require('./models/user');

// Connecting to Database
connect();

// Refreshing the users
refresh()
  .then(() => {
    // Adding listeners for the bot
    listeners.forEach((listener) => {
      new Listener(listener.types, listener.callback).init(bot);
    });

    // Starting the bot
    bot.start();

    // Starting the scheduler for database refresher
    startScheduler();
  });
