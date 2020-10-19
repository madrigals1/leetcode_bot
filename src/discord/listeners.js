const User = require('../repository/user');
const { MASTER_PASSWORD, DISCORD } = require('../utils/constants');
const { BOT_MESSAGES } = require('../utils/dictionary');
const { log, replaceAll } = require('../utils/helper');

const sendFormattedMessage = (channel, message) => {
  // Change bold, italic and code from HTML to Markdown
  let formatted = replaceAll(message, '<b>', '**');
  formatted = replaceAll(formatted, '</b>', '**');
  formatted = replaceAll(formatted, '<i>', '*');
  formatted = replaceAll(formatted, '</i>', '*');
  formatted = replaceAll(formatted, '<code>', '`');
  formatted = replaceAll(formatted, '</code>', '`');

  channel.send(formatted);
};

const listeners = [
  {
    types: ['start'],
    callback: (message) => sendFormattedMessage(
      message.channel, BOT_MESSAGES.WELCOME_TEXT(DISCORD.PREFIX),
    ),
  },
  {
    types: ['add'],
    callback: async (message, userNameList) => {
      // If no username is set, return exception
      if (userNameList.length === 0) {
        return sendFormattedMessage(
          message.channel, BOT_MESSAGES.AT_LEAST_1_USERNAME(DISCORD.PREFIX),
        );
      }

      const resultList = await Promise.all(userNameList.map(async (username) => {
        const result = await User.add(username);
        log(result.detail);
        return result.detail;
      }));

      // Add users and map
      const userDetails = resultList.join('');

      return sendFormattedMessage(message.channel, BOT_MESSAGES.USER_LIST(userDetails));
    },
  },
  {
    types: ['refresh'],
    callback: async (message) => {
      sendFormattedMessage(message.channel, BOT_MESSAGES.STARTED_REFRESH);
      await User.refresh();
      return sendFormattedMessage(message.channel, BOT_MESSAGES.IS_REFRESHED);
    },
  },
  {
    types: ['remove'],
    callback: async (message, userNameList) => {
      // Correct input for removing should be /rm <username> <master_password>
      // If length of the input is not 3, throw error
      if (userNameList.length !== 2) {
        return sendFormattedMessage(message.channel, BOT_MESSAGES.INCORRECT_INPUT);
      }

      // Get username and password from message
      const username = userNameList[0].toLowerCase();
      const password = userNameList[1];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return sendFormattedMessage(message.channel, BOT_MESSAGES.PASSWORD_IS_INCORRECT);
      }

      // Send message, that user will be deleted
      sendFormattedMessage(message.channel, BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username));

      // Remove User and get result
      const result = await User.remove(username);
      log(result.detail);
      return sendFormattedMessage(message.channel, result.detail);
    },
  },
  {
    // Action for clearing Database from users
    types: ['clear'],
    callback: async (message, args) => {
      // Format should be /clear password
      if (args.length !== 1) {
        return sendFormattedMessage(message.channel, BOT_MESSAGES.INCORRECT_INPUT);
      }

      // Get password from message
      const password = args[1];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return sendFormattedMessage(message.channel, BOT_MESSAGES.PASSWORD_IS_INCORRECT);
      }

      // Send message, that Database will be cleared
      sendFormattedMessage(message.channel, BOT_MESSAGES.DATABASE_WILL_BE_CLEARED);

      // Remove all Users and get result
      const result = await User.clear();
      log(result.detail);
      return sendFormattedMessage(message.channel, result.detail);
    },
  },
  {
    types: ['rating'],
    callback: async (message, userNameList) => {
      // If more than 1 User was sent
      if (userNameList.length > 1) {
        return sendFormattedMessage(message.channel, BOT_MESSAGES.INCORRECT_INPUT);
      }

      // If 1 User was sent
      if (userNameList.length === 1) {
        const username = userNameList[0].toLowerCase();
        const user = User.load(username);

        let result;

        if (user) {
          result = sendFormattedMessage(message.channel, BOT_MESSAGES.USER_TEXT(user));
        } else {
          result = sendFormattedMessage(message.channel, BOT_MESSAGES.USERNAME_NOT_FOUND(username));
        }

        return result;
      }

      // If 0 User was sent
      return sendFormattedMessage(message.channel, BOT_MESSAGES.RATING_TEXT(User.all()));
    },
  },
];

module.exports = listeners;
