const moment = require('moment');

const { users } = require('./database');
const userModel = require('./user');
const { log } = require('../utils/helper');
const {
  LEETCODE_URL,
  MASTER_PASSWORD,
  DICT,
} = require('../utils/constants');

let isRefreshing = false;
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

const ratingText = () => (
  users
    ? users.map((user, index) => `${index + 1}. *${user.username}* ${user.solved}\n`).join('')
    : DICT.DATABASE.NO_USERS
);

const resort = () => users.sort(
  (user1, user2) => parseInt(user2.solved, 10) - parseInt(user1.solved, 10),
);

const refreshUsers = async () => {
  const now = moment();
  if (!isRefreshing) {
    isRefreshing = true;
    log(DICT.DATABASE.STARTED_REFRESH, now.format('YYYY-MM-DD hh:mm a'));
    await userModel.refresh().then(() => resort());
  } else {
    log(DICT.DATABASE.IS_ALREADY_REFRESHING);
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
      if (userNameList.length === 1) return msg.reply.text(DICT.MESSAGE.AT_LEAST_1_USERNAME);

      // Removing /add
      userNameList.shift();

      // Promise list from adding users to database
      const promiseList = [];
      userNameList.forEach((username) => {
        promiseList.push(userModel.add(username)
          .then((user) => {
            if (user && user.username !== DICT.STATUS.ERROR.DEFAULT) {
              users.push(user);
              return DICT.MESSAGE.USERNAME_WAS_ADDED(username);
            }
            return DICT.MESSAGE.USERNAME_WAS_NOT_ADDED(username);
          }));
      });

      resort();

      const userListFromPromise = await Promise.all(promiseList);
      const text = userListFromPromise.join('');
      msg.reply.text(`${DICT.MESSAGE.USER_LIST}${text}`);
      await refreshUsers();
      return msg.reply.text(DICT.DATABASE.USERS_ARE_REFRESHED);
    },
  },
  {
    types: ['/refresh', '/r'],
    callback: async (msg) => {
      await refreshUsers();
      return msg.reply.text(DICT.DATABASE.IS_REFRESHED);
    },
  },
  {
    types: ['/rating', '/rt'],
    callback: (msg) => {
      const userNameList = msg.text.split(' ');
      if (userNameList.length > 2 || userNameList.length === 0) {
        return msg.reply(DICT.STATUS.ERROR.INCORRECT_INPUT);
      }

      if (userNameList.length === 2) {
        const userName = userNameList[1].toLowerCase();
        const user = users.find((u) => u.username.toLowerCase() === userName);
        if (!user) {
          return msg.reply.text(DICT.DATABASE.NO_USERS);
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
        return msg.reply.text(DICT.STATUS.ERROR.INCORRECT_INPUT);
      }

      const username = userNameList[1].toLowerCase();
      const password = userNameList[2];
      const user = users.find((u) => u.username.toLowerCase() === username);

      if (!user) {
        return msg.reply.text(DICT.DATABASE.NO_USERS);
      }

      if (password !== MASTER_PASSWORD) {
        return msg.reply.text(DICT.STATUS.ERROR.PASSWORD_IS_INCORRECT);
      }

      await userModel.remove(user.id);
      msg.reply.text(DICT.MESSAGE.USERNAME_WILL_BE_DELETED(username));
      await refreshUsers();
      return msg.reply.text(DICT.MESSAGE.USERNAME_WAS_DELETED(username));
    },
  },
];

module.exports = {
  users,
  listeners,
  refreshUsers,
};
