const moment = require('moment');

const { welcomeMessage } = require('../utils/constants');
const { users } = require('./database');
const userModel = require('./user');
const { log } = require('../utils/helper');

let lastRefresh = null;

const welcomeText = () => `${welcomeMessage}`;

const userText = (user) => `*Name:* ${user.name}
*Username:* ${user.username}
*Solved:* ${user.solved}`;

const ratingText = () => users
  .map((user, index) => `${index + 1}. *${user.username}* ${user.solved}\n`)
  .join('');

const resort = () => users.sort(
  (user1, user2) => parseInt(user2.solved, 10) - parseInt(user1.solved, 10),
);

const refreshUsers = async () => {
  const now = moment();
  if (!lastRefresh || now.diff(lastRefresh, 'seconds') > 60) {
    lastRefresh = now;
    log('Database started refresh', now.format('YYYY-MM-DD hh:mm a'));
    await userModel.refresh()
      .then(() => resort());
  } else {
    log('Cant refresh more than once in a minute');
  }
};

const listeners = [
  {
    types: ['/start'],
    callback: (msg) => msg.reply.text(welcomeText(), { parseMode: 'HTML' }),
  },
  {
    types: ['/add'],
    callback: async (msg) => {
      // Getting all users list from /add username1 username2
      const userNameList = msg.text.split(' ');

      // If no username is set, return exception
      if (userNameList.length === 1) return msg.reply.text('Please, enter at least 1 username after /add command');

      // Removing /add
      userNameList.shift();

      // Promise list from adding users to database
      const promiseList = [];
      userNameList.forEach((username) => {
        promiseList.push(userModel.add(username)
          .then((user) => {
            if (user && user.username !== 'Error') {
              users.push(user);
              return `- ${username} was added\n`;
            }
            return `- ${username} was not added\n`;
          }));
      });

      resort();

      const userListFromPromise = await Promise.all(promiseList);
      const text = userListFromPromise.join('');
      msg.reply.text(`User List:\n ${text}`);
      await refreshUsers();
      return msg.reply.text('Users refreshed');
    },
  },
  {
    types: ['/refresh'],
    callback: async (msg) => {
      await refreshUsers();
      return msg.reply.text('Database is refreshed');
    },
  },
  {
    types: ['/rating'],
    callback: (msg) => {
      const userNameList = msg.text.split(' ');
      if (userNameList.length > 2 || userNameList.length === 0) {
        return msg.reply('Incorrect input');
      }

      if (userNameList.length === 2) {
        const userName = userNameList[1];
        const user = users.find((u) => u.username === userName);
        return msg.reply.text(userText(user), { parseMode: 'Markdown' });
      }
      return msg.reply.text(ratingText(), { parseMode: 'Markdown' });
    },
  },
];

module.exports = {
  users,
  listeners,
  refreshUsers,
};