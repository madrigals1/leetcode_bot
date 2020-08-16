const User = require('./repository/user');
const { MASTER_PASSWORD } = require('./utils/constants');
const DICT = require('./utils/dictionary');

module.exports = [
  {
    types: ['/start', '/s'],
    callback: (msg) => msg.reply.text(DICT.WELCOME_TEXT(), { parseMode: 'HTML' }),
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

      const detailList = await Promise.all(userNameList.map(async (username) => {
        const data = await User.add(username);
        return `- <b>${username}</b> - ${data.detail}\n`;
      }));

      // Add users and map
      const text = detailList.join('');

      return msg.reply.text(`${DICT.MESSAGE.USER_LIST}${text}`, { parseMode: 'HTML' });
    },
  },
  {
    types: ['/refresh', '/r'],
    callback: async (msg) => {
      await User.refresh();
      return msg.reply.text(DICT.DATABASE.IS_REFRESHED);
    },
  },
  {
    types: ['/rating', '/rt'],
    callback: async (msg) => {
      const userNameList = msg.text.split(' ');

      // If more than 1 User was sent
      if (userNameList.length > 2) return msg.reply(DICT.STATUS.ERROR.INCORRECT_INPUT);

      // If 1 User was sent
      if (userNameList.length === 2) {
        const username = userNameList[1].toLowerCase();
        const user = User.load(username);

        return user
          ? msg.reply.text(DICT.USER_TEXT(user), { parseMode: 'HTML' })
          : msg.reply.text(DICT.DATABASE.NO_USERS);
      }

      // If 0 User was sent
      return msg.reply.text(DICT.RATING_TEXT(User.all()), { parseMode: 'Markdown' });
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

      if (password !== MASTER_PASSWORD) {
        return msg.reply.text(DICT.STATUS.ERROR.PASSWORD_IS_INCORRECT);
      }

      const result = await User.remove(username);
      return msg.reply.text(`- ${username} - ${result.detail}`);
    },
  },
];
