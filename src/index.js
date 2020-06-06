const TeleBot = require('telebot');
const schedule = require('node-schedule');
const moment = require('moment');
const { TELEGRAM_TOKEN } = require('./utils/constants');
const Database = require('./models/database');
const system = require('./models/system');
const { refreshLog } = require('./utils/helper');

const bot = new TeleBot(TELEGRAM_TOKEN);

function callbackForUser(msg, uname) {
  Database.loadUser(uname).then((data) => {
    const {
      name, username, solved, error,
    } = data;
    if (error) {
      return msg.reply.text(`Error is encountered: ${error}`);
    }
    return msg.reply.text(`Name: ${name} \nUsername: ${username} \nSolved: ${solved} \n`);
  });
}

function addListenerIfNotExist(username) {
  if (!system.addedListeners.includes(username)) {
    bot.on([`/${username.toLowerCase()}`], (msg) => callbackForUser(msg, username));
    system.addedListeners.push(username);
  }
}


async function refreshUsers() {
  const now = moment();
  if (!system.lastRefresh || now.diff(system.lastRefresh, 'seconds') > 60) {
    system.lastRefresh = now;
    console.log('Database started refresh', now.format('YYYY-MM-DD hh:mm a'));
    await Database.refreshUsers()
      .then(() => {
        system.users.forEach((user) => {
          addListenerIfNotExist(user.username);
        });
        system.users.resort();
      })
      .catch((err) => console.error(err));
  } else {
    console.log('Cant refresh more than once in a minute');
  }
}

bot.on(['/start'], (msg) => msg.reply.text(system.welcomeText, { parseMode: 'HTML' }));

bot.on(['/add'], async (msg) => {
  const userNameList = msg.text.split(' ');
  if (userNameList.length === 1) return msg.reply.text('Please, enter at least 1 username after /add command');
  let userNameListText = '';
  const results = [];
  for (let i = 1; i < userNameList.length; i++) {
    results.push(Database.addUser(userNameList[i])
      .then((user) => {
        if (user) {
          system.users.push(user);
          system.users.resort();
          userNameListText += `${user.username}\n`;
          addListenerIfNotExist(user.username);
        }
      })
      .catch((err) => {
        console.error(err);
      }));
  }
  await Promise.all(results);
  refreshUsers().then(() => {});
  return msg.reply.text(`Users that were added:\n ${userNameListText}`);
});

bot.on(['/refresh'], (msg) => {
  refreshUsers().then(() => {});
  msg.reply.text('Database will be refreshed');
});

bot.on(['/rating'], async (msg) => msg.reply.text(system.ratingText, { parseMode: 'Markdown' }));

bot.start();

refreshUsers().then(refreshLog);

schedule.scheduleJob('*/15 * * * *', () => {
  refreshUsers().then(refreshLog);
});
