const User = require('./repository/user');
const { MASTER_PASSWORD } = require('./utils/constants');
const DICT = require('./utils/dictionary');
const bot = require('./objects/bot');
const { log, isRegexMatchInArray } = require('./utils/helper');

const ratingTypes = [/\/rating/g];
const ratingCallback = async (msg, callbackQuery = false, data = null) => {
  let text;

  if (!callbackQuery) {
    text = msg.text;
  } else {
    text = data;
  }

  const userNameList = text.split(' ');

  // If more than 1 User was sent
  if (userNameList.length > 2) bot.sendMessage(msg.chat.id, DICT.STATUS.ERROR.INCORRECT_INPUT);

  // If 1 User was sent
  if (userNameList.length === 2) {
    const username = userNameList[1].toLowerCase();
    const user = User.load(username);

    let result;

    if (user) {
      result = bot.sendMessage(msg.chat.id, DICT.USER_TEXT(user), { parse_mode: 'HTML' });
    } else {
      result = bot.sendMessage(msg.chat.id, DICT.DATABASE.NO_USERS);
    }

    return result;
  }

  // Retrieve users from repo
  const users = User.all();

  // Create menu for users
  const usersInlineKeyboard = users.map((user) => (
    [
      {
        text: `${user.username}`,
        callback_data: `/rating ${user.username}`,
      },
    ]
  ));

  const replyMarkup = JSON.stringify({
    inline_keyboard: usersInlineKeyboard,
  });

  // Options for be.sendMessage
  const options = {
    parse_mode: 'Markdown',
    reply_markup: replyMarkup,
  };

  // If 0 User was sent
  return bot.sendMessage(msg.chat.id, DICT.RATING_TEXT(users), options);
};

const listeners = [
  {
    actionType: 'onText',
    types: [/\/start/g],
    callback: (msg) => bot.sendMessage(
      msg.chat.id, DICT.WELCOME_TEXT(), { parse_mode: 'HTML' },
    ),
  },
  {
    actionType: 'onText',
    types: [/\/add/g],
    callback: async (msg) => {
      // Getting all users list from /add username1 username2
      const userNameList = msg.text.split(' ');

      // If no username is set, return exception
      if (userNameList.length === 1) {
        return bot.sendMessage(msg.chat.id, DICT.MESSAGE.AT_LEAST_1_USERNAME);
      }

      // Removing /add
      userNameList.shift();

      const detailList = await Promise.all(userNameList.map(async (username) => {
        const data = await User.add(username);
        return `- <b>${username}</b> - ${data.detail}\n`;
      }));

      // Add users and map
      const text = detailList.join('');

      return bot.sendMessage(
        msg.chat.id, `${DICT.MESSAGE.USER_LIST}${text}`, { parse_mode: 'HTML' },
      );
    },
  },
  {
    actionType: 'onText',
    types: [/\/refresh/g],
    callback: async (msg) => {
      bot.sendMessage(msg.chat.id, DICT.DATABASE.STARTED_REFRESH).then(() => {
      });
      await User.refresh();
      return bot.sendMessage(msg.chat.id, DICT.DATABASE.IS_REFRESHED);
    },
  },
  {
    actionType: 'onText',
    types: ratingTypes,
    callback: (msg) => ratingCallback(msg),
  },
  {
    actionType: 'onText',
    types: [/\/remove/g],
    callback: async (msg) => {
      const userNameList = msg.text.split(' ');

      // Correct input for removing should be /rm <username> <master_password>
      // If length of the input is not 3, throw error
      if (userNameList.length !== 3) {
        return bot.sendMessage(msg.chat.id, DICT.STATUS.ERROR.INCORRECT_INPUT);
      }

      const username = userNameList[1].toLowerCase();
      const password = userNameList[2];

      if (password !== MASTER_PASSWORD) {
        return bot.sendMessage(msg.chat.id, DICT.STATUS.ERROR.PASSWORD_IS_INCORRECT);
      }

      const result = await User.remove(username);
      return bot.sendMessage(msg.chat.id, `- ${username} - ${result.detail}`);
    },
  },
  {
    actionType: 'on',
    types: ['polling_error'],
    callback: (err) => log(err),
  },
  {
    actionType: 'on',
    types: ['callback_query'],
    callback: (query) => {
      const { message, data } = query;

      let result;

      if (isRegexMatchInArray(data, ratingTypes)) result = ratingCallback(message, true, data);

      return result;
    },
  },
];

module.exports = listeners;
