import { token } from './utils/config';
import TeleBot from 'telebot';
import moment from 'moment';
import Database from './utils/database';
import system from './models/system';
import schedule from 'node-schedule';
import { refreshLog } from './utils/helper';

const bot = new TeleBot(token);

function addListenerIfNotExist(username) {
  if (!system.addedListeners.includes(username)) {
    bot.on(['/' + username.toLowerCase()], (msg) => callbackForUser(msg, username));
    system.addedListeners.push(username);
  }
}

function callbackForUser(msg, username) {
  Database.loadUser(username).then(data => {
    const { name, username, solved, error } = data;
    if (error) {
      return msg.reply.text(`Error is encountered: ${error}`);
    }
    return msg.reply.text(`Name: ${name} \nUsername: ${username} \nSolved: ${solved} \n`);
  });
}

async function refreshUsers() {
  const now = moment();
  if (!system.lastRefresh || now.diff(system.lastRefresh, 'seconds') > 60) {
    system.lastRefresh = now;
    console.log('Database started refresh', now.format('YYYY-MM-DD hh:mm a'));
    await Database.refreshUsers()
      .then(() => {
        system.users.forEach(user => {
          addListenerIfNotExist(user.username);
        });
      })
      .catch(err => console.error(err));
  } else {
    console.log('Cant refresh more than once in a minute');
  }
}

bot.on(['/start'], (msg) => {
  return msg.reply.text(system.welcomeText, { parseMode: 'HTML' });
});

bot.on(['/add'], async (msg) => {
  const userNameList = msg.text.split(' ');
  if (userNameList.length === 1) return msg.reply.text('Please, enter at least 1 username after /add command');
  let userNameListText = '';
  for (let i = 1; i < userNameList.length; i++) {
    await Database.addUser(userNameList[i])
      .then(user => {
        if (user) {
          system.users.push(user);
          system.users.sort((user1, user2) => parseInt(user2.solved) - parseInt(user1.solved));
          userNameListText += `${user.username}\n`;
          addListenerIfNotExist(user.username);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  msg.reply.text(`Users that were added:\n ${userNameListText}`);
  refreshUsers().then(() => {
  });
});

bot.on(['/refresh'], (msg) => {
  refreshUsers().then(() => {
  });
  msg.reply.text('Database will be refreshed');
});

bot.on(['/rating'], async msg => {
  return msg.reply.text(system.ratingText, { parseMode: 'Markdown' });
});

bot.start();

refreshUsers().then(refreshLog);

schedule.scheduleJob('*/15 * * * *', function() {
  refreshUsers().then(refreshLog);
});
