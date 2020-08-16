const listeners = require('./listeners');
const bot = require('./objects/bot');
const startScheduler = require('./utils/scheduler');
const Listener = require('./objects/listener');
const Database = require('./database');
const User = require('./repository/user');

// Connecting to Database
Database.connect().then(() => {
  // Refreshing the users
  User.refresh()
    .then(() => {
      // Adding listeners for the bot
      listeners.forEach((listener) => {
        new Listener(listener.actionType, listener.types, listener.callback).init(bot);
      });

      // Starting the scheduler for database refresher
      startScheduler();
    });
});
