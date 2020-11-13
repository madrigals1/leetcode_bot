const { BOT_MESSAGES, SERVER_MESSAGES } = require('../utils/dictionary');
const User = require('../cache/user');
const { log } = require('../utils/helper');
const { MASTER_PASSWORD } = require('../utils/constants');
const { EMOJI } = require('../utils/constants');

const { tableForSubmissions, createUserListReplyMarkup } = require('./utils');

const actions = [
  {
    name: 'start',
    execute: (args, reply, context) => (
      reply(BOT_MESSAGES.WELCOME_TEXT(context.prefix), context)
    ),
  },
  {
    name: 'add',
    execute: async (args, reply, context) => {
      // If no username is set, return exception
      if (args.length === 0) {
        return reply(BOT_MESSAGES.AT_LEAST_1_USERNAME(context.prefix), context);
      }

      // Variable to store text to return back to chat
      let userDetails = '';

      // Promise List with promises for adding users
      for (let i = 0; i < args.length; i++) {
        // Get username
        const username = args[i];

        // Get results of adding
        // eslint-disable-next-line no-await-in-loop
        const result = await User.add(username);

        // Log result detail
        log(result.detail);

        userDetails += result.detail;
      }

      return reply(BOT_MESSAGES.USER_LIST(userDetails), context);
    },
  },
  {
    name: 'refresh',
    execute: async (args, reply, context) => (
      reply(BOT_MESSAGES.STARTED_REFRESH, context).then(async () => {
        const result = await User.refresh();
        return reply(result, context);
      })
    ),
  },
  {
    name: 'remove',
    execute: async (args, reply, context) => {
      // Correct input for removing should be /rm <username> <master_password>
      // If length of args is not 2, return error message
      if (args.length !== 2) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get username and password from message
      const username = args[0].toLowerCase();
      const password = args[1];

      // If password is incorrect, return error message
      if (password !== MASTER_PASSWORD) {
        return reply(BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Send message, that user will be deleted
      return reply(
        BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username),
        context,
      ).then(async () => {
        // Remove the user and send the result (success or failure)
        const result = await User.remove(username);
        log(result.detail);
        return reply(result.detail, context);
      });
    },
  },
  {
    name: 'clear',
    execute: async (args, reply, context) => {
      // Correct input for removing should be /clear <master_password>
      // If length of args is not 1, return error message
      if (args.length !== 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get password from message
      const password = args[0];

      // If password is incorrect, return error message
      if (password !== MASTER_PASSWORD) {
        return reply(BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Send message, that Database will be cleared
      return reply(BOT_MESSAGES.DATABASE_WILL_BE_CLEARED, context)
        .then(async () => {
          // Remove all Users and send the result (success or failure)
          const result = await User.clear();
          log(result.detail);
          return reply(result.detail, context);
        });
    },
  },
  {
    name: 'stats',
    execute: async (args, reply, context) => {
      // Correct input for removing should be /stats <master_password>
      // If length of args is not 1, return error message
      if (args.length !== 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get password from message
      const password = args[0];

      // If password is incorrect, return error message
      if (password !== MASTER_PASSWORD) {
        return reply(BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Get Users
      const users = await User.all();

      // Send message with stats
      return reply(BOT_MESSAGES.STATS_TEXT(context.provider, users), context);
    },
  },
  {
    name: 'rating',
    execute: async (args, reply, context) => {
      // If more than 1 User was sent
      if (args.length > 1) return reply(BOT_MESSAGES.INCORRECT_INPUT, context);

      // If 1 User was sent
      if (args.length === 1) {
        const username = args[0].toLowerCase();
        const user = User.load(username);

        // If user does exist, return user data with reply markup
        if (user) {
          context.options.reply_markup = createUserListReplyMarkup({
            isOnlyHeader: true,
            header: `${EMOJI.CARD_FILE_BOX} Rating`,
            command: '/rating',
          });

          return reply(BOT_MESSAGES.USER_TEXT(user), context);
        }

        return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: User.all(),
        footer: `${EMOJI.CROSS_MARK} Close`,
        command: '/rating',
      });

      return reply(BOT_MESSAGES.RATING_TEXT(User.all()), context);
    },
  },
  {
    name: 'avatar',
    execute: async (args, reply, context) => {
      // If incorrect number of args provided, return incorrect input
      if (args.length > 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // If 1 User was sent
      if (args.length === 1) {
        // Get User from args
        const username = args[0].toLowerCase();
        const user = User.load(username);

        if (user) {
          // Add photo to context
          context.photoUrl = user.avatar;
          return reply('', context);
        }

        return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: User.all(),
        footer: `${EMOJI.CROSS_MARK} Close`,
        command: '/avatar',
      });

      // If 0 User was sent
      return reply(BOT_MESSAGES.USER_LIST_AVATARS, context);
    },
  },
  {
    name: 'submissions',
    execute: async (args, reply, context) => {
      // If incorrect number of args provided, return incorrect input
      if (args.length > 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // If 1 User was sent
      if (args.length === 1) {
        // Get User from args
        const username = args[0].toLowerCase();
        const user = User.load(username);

        // If User does not exist, return error message
        if (!user) {
          return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
        }

        // Create HTML image with Table
        const table = await tableForSubmissions(user);

        // If image was created
        if (table.link) {
          // Add image to context
          context.photoUrl = table.link;

          return reply('', context);
        }

        // If error is because of User not having any submissions
        if (table.reason === SERVER_MESSAGES.NO_SUBMISSIONS) {
          return reply(table.error, context);
        }

        // If image link was not achieved from Table API
        return reply(BOT_MESSAGES.ERROR_ON_THE_SERVER, context);
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: User.all(),
        footer: `${EMOJI.CROSS_MARK} Close`,
        command: '/submissions',
      });

      // If 0 User was sent
      return reply(BOT_MESSAGES.USER_LIST_SUBMISSIONS, context);
    },
  },
];

module.exports = { actions };
