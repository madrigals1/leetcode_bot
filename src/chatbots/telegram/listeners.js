const User = require('../../cache/user');
const { MASTER_PASSWORD, TELEGRAM, EMOJI } = require('../../utils/constants');
const { BOT_MESSAGES } = require('../../utils/dictionary');
const { log, isRegexMatchInArray } = require('../../utils/helper');

const bot = require('./bot');

const createReplyMarkup = (users) => {
  // Create menu for users
  const usersInlineKeyboard = [];

  for (let i = 0; i < Math.ceil(users.length / 3); i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = (i * 3) + j;
      if (index < users.length) {
        const user = users[index];
        row.push({
          text: `${user.username}`,
          callback_data: `/rating ${user.username}`,
        });
      }
    }
    usersInlineKeyboard.push(row);
  }

  // Button for closing Keyboard Menu
  usersInlineKeyboard.push([{
    text: `${EMOJI.CROSS_MARK} Close`,
    callback_data: 'placeholder',
  }]);

  return JSON.stringify({
    inline_keyboard: usersInlineKeyboard,
  });
};
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
  if (userNameList.length > 2) bot.sendMessage(msg.chat.id, BOT_MESSAGES.INCORRECT_INPUT);

  // Load users from repo
  const users = User.all();

  // Options for be.sendMessage
  const options = {
    parse_mode: 'HTML',
    reply_markup: createReplyMarkup(users),
  };

  // If 1 User was sent
  if (userNameList.length === 2) {
    const username = userNameList[1].toLowerCase();
    const user = User.load(username);

    let result;

    if (user) {
      result = bot.sendMessage(msg.chat.id, BOT_MESSAGES.USER_TEXT(user), options);
    } else {
      result = bot.sendMessage(
        msg.chat.id, BOT_MESSAGES.USERNAME_NOT_FOUND(username), { parse_mode: 'HTML' },
      );
    }

    return result;
  }

  // If 0 User was sent
  return bot.sendMessage(msg.chat.id, BOT_MESSAGES.RATING_TEXT(User.all()), options);
};

const listeners = [
  {
    actionType: 'onText',
    types: [/\/start/g],
    callback: (msg) => bot.sendMessage(
      msg.chat.id, BOT_MESSAGES.WELCOME_TEXT(TELEGRAM.PREFIX), { parse_mode: 'HTML' },
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
        return bot.sendMessage(
          msg.chat.id,
          BOT_MESSAGES.AT_LEAST_1_USERNAME(TELEGRAM.PREFIX),
          { parse_mode: 'HTML' },
        );
      }

      // Removing /add
      userNameList.shift();

      const resultList = await Promise.all(userNameList.map(async (username) => {
        const result = await User.add(username);
        log(result.detail);
        return result.detail;
      }));

      // Add users and map
      const userDetails = resultList.join('');

      return bot.sendMessage(
        msg.chat.id, BOT_MESSAGES.USER_LIST(userDetails), { parse_mode: 'HTML' },
      );
    },
  },
  {
    actionType: 'onText',
    types: [/\/refresh/g],
    callback: async (msg) => bot.sendMessage(msg.chat.id, BOT_MESSAGES.STARTED_REFRESH)
      .then(async () => {
        await User.refresh();
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.IS_REFRESHED);
      }),
  },
  {
    actionType: 'onText',
    types: [/\/avatar/g],
    callback: async (msg) => {
      const userNameList = msg.text.split(' ');
      userNameList.shift();

      // If more than 1 User on no User was sent
      if (userNameList.length !== 1) {
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.INCORRECT_INPUT);
      }

      const username = userNameList[0].toLowerCase();
      const user = User.load(username);

      if (user) {
        return bot.sendPhoto(msg.chat.id, user.avatar, { caption: user.link });
      }

      return bot.sendMessage(
        msg.chat.id, BOT_MESSAGES.USERNAME_NOT_FOUND(username), { parse_mode: 'HTML' },
      );
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
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.INCORRECT_INPUT);
      }

      // Get username and password from message
      const username = userNameList[1].toLowerCase();
      const password = userNameList[2];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.PASSWORD_IS_INCORRECT);
      }

      // Send message, that user will be deleted
      return bot.sendMessage(
        msg.chat.id, BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username), { parse_mode: 'HTML' },
      ).then(async () => {
        // Remove the user and send the result (success or failure)
        const result = await User.remove(username);
        log(result.detail);
        return bot.sendMessage(msg.chat.id, result.detail, { parse_mode: 'HTML' });
      });
    },
  },
  {
    actionType: 'onText',
    types: [/\/clear/g],
    callback: async (msg) => {
      const args = msg.text.split(' ');

      // Correct input for removing should be /clear <master_password>
      // If length of the input is not 2, throw error
      if (args.length !== 2) {
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.INCORRECT_INPUT);
      }

      // Get password from message
      const password = args[1];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return bot.sendMessage(msg.chat.id, BOT_MESSAGES.PASSWORD_IS_INCORRECT);
      }

      // Send message, that Database will be cleared
      return bot.sendMessage(
        msg.chat.id, BOT_MESSAGES.DATABASE_WILL_BE_CLEARED, { parse_mode: 'HTML' },
      ).then(async () => {
        // Remove all Users and send the result (success or failure)
        const result = await User.clear();
        log(result.detail);
        return bot.sendMessage(msg.chat.id, result.detail, { parse_mode: 'HTML' });
      });
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

      bot.answerCallbackQuery(query.id)
        .then(() => {
          bot.deleteMessage(message.chat.id, message.message_id);
        });

      let result;

      if (isRegexMatchInArray(data, ratingTypes)) {
        result = ratingCallback(message, true, data);
      }

      return result;
    },
  },
];

module.exports = listeners;
