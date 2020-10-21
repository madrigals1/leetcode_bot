const User = require('../../cache/user');
const { MASTER_PASSWORD, DISCORD } = require('../../utils/constants');
const { BOT_MESSAGES } = require('../../utils/dictionary');
const { log, replaceAll } = require('../../utils/helper');

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
    // !start
    types: ['start'],
    callback: (message) => sendFormattedMessage(
      message.channel, BOT_MESSAGES.WELCOME_TEXT(DISCORD.PREFIX),
    ),
  },
  {
    // !add <username1> <username2>
    types: ['add'],
    callback: async (message, userNameList) => {
      // If no username is set, return exception
      if (userNameList.length === 0) {
        return sendFormattedMessage(
          message.channel, BOT_MESSAGES.AT_LEAST_1_USERNAME(DISCORD.PREFIX),
        );
      }

      // Add all Users 1 by 1 and create Promise List
      const promiseList = userNameList.map(async (username) => {
        const result = await User.add(username);
        log(result.detail);
        return result.detail;
      });

      // Await all Promises
      const resultList = await Promise.all(promiseList);

      // Add users and map
      const userListDetails = resultList.join('');

      return sendFormattedMessage(
        message.channel,
        BOT_MESSAGES.USER_LIST(userListDetails),
      );
    },
  },
  {
    // !refresh
    types: ['refresh'],
    callback: async (message) => {
      sendFormattedMessage(message.channel, BOT_MESSAGES.STARTED_REFRESH);
      await User.refresh();
      return sendFormattedMessage(message.channel, BOT_MESSAGES.IS_REFRESHED);
    },
  },
  {
    // !remove <username> <master_password>
    types: ['remove'],
    callback: async (message, args) => {
      // If length of the input is not 3, throw error
      if (args.length !== 2) {
        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.INCORRECT_INPUT,
        );
      }

      // Get username and password from args
      const username = args[0].toLowerCase();
      const password = args[1];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.PASSWORD_IS_INCORRECT,
        );
      }

      // Send message, that user will be deleted
      sendFormattedMessage(
        message.channel,
        BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username),
      );

      // Remove User and get result
      const result = await User.remove(username);
      log(result.detail);
      return sendFormattedMessage(message.channel, result.detail);
    },
  },
  {
    // !clear <master_password>
    types: ['clear'],
    callback: async (message, args) => {
      if (args.length !== 1) {
        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.INCORRECT_INPUT,
        );
      }

      // Get password from message
      const password = args[1];

      // If password is incorrect, send appropriate message
      if (password !== MASTER_PASSWORD) {
        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.PASSWORD_IS_INCORRECT,
        );
      }

      // Send message, that Database will be cleared
      sendFormattedMessage(
        message.channel,
        BOT_MESSAGES.DATABASE_WILL_BE_CLEARED,
      );

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
        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.INCORRECT_INPUT,
        );
      }

      // If 1 User was sent
      if (userNameList.length === 1) {
        // Get username from args
        const username = userNameList[0].toLowerCase();

        // Load User from cache by username
        const user = User.load(username);

        if (user) {
          return sendFormattedMessage(
            message.channel,
            BOT_MESSAGES.USER_TEXT(user),
          );
        }

        return sendFormattedMessage(
          message.channel,
          BOT_MESSAGES.USERNAME_NOT_FOUND(username),
        );
      }

      // If 0 User was sent
      return sendFormattedMessage(
        message.channel,
        BOT_MESSAGES.RATING_TEXT(User.all()),
      );
    },
  },
];

module.exports = listeners;
