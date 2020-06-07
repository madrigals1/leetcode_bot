const { listeners } = require('./models/system');
const bot = require('./models/bot');
const startScheduler = require('./utils/scheduler');
const Listener = require('./models/listener');
const { connect } = require('./models/database');
const { refresh } = require('./models/user');

// Adding listeners after refreshing the users
refresh()
  .then(() => {
    listeners.forEach((listener) => {
      new Listener(listener.types, listener.callback).init(bot);
    });
  });

// Connecting to Database
connect();

// Starting the bot
bot.start();

// Starting the scheduler for database refresher
startScheduler();
