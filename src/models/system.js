const moment = require('moment');

const { users } = require('./database');
const userModel = require('./user');
const { log } = require('../utils/helper');
const { LEETCODE_URL, MASTER_PASSWORD } = require('../utils/constants');

let lastRefresh = null;
const url = LEETCODE_URL.slice(0, -1);

const welcomeText = () => `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/rating username</i></b> - Rating for separate user
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;

const userText = (user) => `<b>Name:</b> ${user.name}
<b>Username:</b> ${user.username}
<b>Link:</b> ${user.link}
<b>Solved:</b> ${user.solved} / ${user.all}

<b>Last ${user.submissions.length} Submissions:</b>
${user.submissions.map((submission) => `
<b>${submission.name}</b>
<b>Link:</b> ${url}${submission.link}
<b>Status:</b> ${submission.status}
<b>Language:</b> ${submission.language}
<b>Time:</b> ${submission.time}
`).join('\n')}`;

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
    types: ['/start', '/s'],
    callback: (msg) => msg.reply.text(welcomeText(), { parseMode: 'HTML' }),
  },
  {
    types: ['/add', '/a'],
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
    types: ['/refresh', '/r'],
    callback: async (msg) => {
      await refreshUsers();
      return msg.reply.text('Database is refreshed');
    },
  },
  {
    types: ['/rating', '/rt'],
    callback: (msg) => {
      const userNameList = msg.text.split(' ');
      if (userNameList.length > 2 || userNameList.length === 0) {
        return msg.reply('Incorrect input');
      }

      if (userNameList.length === 2) {
        const userName = userNameList[1].toLowerCase();
        const user = users.find((u) => u.username.toLowerCase() === userName);
        if (!user) {
          return msg.reply.text('Error, caused by these:\n- Username is not added to database\n- Username does not exist');
        }
        return msg.reply.text(userText(user), { parseMode: 'HTML' });
      }
      return msg.reply.text(ratingText(), { parseMode: 'Markdown' });
    },
  },
  {
    types: ['/remove', '/rm'],
    callback: async (msg) => {
      const userNameList = msg.text.split(' ');

      // Correct input for removing should be /rm <username> <master_password>
      // If length of the input is not 3, throw error
      if (userNameList.length !== 3) {
        return msg.reply.text('Incorrect input');
      }

      const userName = userNameList[1].toLowerCase();
      const password = userNameList[2];
      const user = users.find((u) => u.username.toLowerCase() === userName);

      if (!user) {
        return msg.reply.text('Error, caused by these:\n- Username is not added to database\n- Username does not exist');
      }

      if (password !== MASTER_PASSWORD) {
        return msg.reply.text('Password is incorrect');
      }

      await userModel.remove(user.id);
      msg.reply.text(`User ${userName} will be deleted`);
      await refreshUsers();
      return msg.reply.text(`User ${userName} was deleted`);
    },
  },
];

module.exports = {
  users,
  listeners,
  refreshUsers,
};
