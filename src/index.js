const { listeners } = require('./models/system');
const bot = require('./models/bot');
const startScheduler = require('./utils/scheduler');
const Listener = require('./models/listener');
const Database = require('./models/database');

Database.refreshUsers().then(() => {
  listeners.forEach((listener) => {
    const listenerObject = new Listener(listener.types, listener.callback);
    listenerObject.init(bot);
  });
});

bot.start();
startScheduler();
