const nodeHtmlToImage = require('node-html-to-image');
const imgur = require('imgur');

const { BOT_MESSAGES, SERVER_MESSAGES } = require('../utils/dictionary');
const User = require('../cache/user');
const { log, error } = require('../utils/helper');
const { MASTER_PASSWORD } = require('../utils/constants');

const {
  generateImagePath, tableForSubmissions, deleteFile,
} = require('./utils');

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

      // Promise List with promises for adding users
      const promiseList = args.map(async (username) => {
        const result = await User.add(username);
        log(result.detail);
        return result.detail;
      });

      // Resolve promise list
      const resultList = await Promise.all(promiseList);

      // Make results into single string and return
      const userDetails = resultList.join('');

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
    name: 'rating',
    execute: async (args, reply, context) => {
      // If more than 1 User was sent
      if (args.length > 1) return reply(BOT_MESSAGES.INCORRECT_INPUT, context);

      // If 1 User was sent
      if (args.length === 1) {
        const username = args[0].toLowerCase();
        const user = User.load(username);

        // If user does exist, return user data with reply markup
        if (user) return reply(BOT_MESSAGES.USER_TEXT(user), context);

        return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
      }

      // If 0 User was sent
      return reply(BOT_MESSAGES.RATING_TEXT(User.all()), context);
    },
  },
  {
    name: 'avatar',
    execute: async (args, reply, context) => {
      // If more than 1 User on no User was sent
      if (args.length !== 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      const username = args[0].toLowerCase();
      const user = User.load(username);

      if (user) {
        // Add photo to context
        context.photoUrl = user.avatar;
        return reply('', context);
      }

      return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
    },
  },
  {
    name: 'submissions',
    execute: async (args, reply, context) => {
      // If incorrect number of args provided, return incorrect input
      if (args.length !== 1) {
        return reply(BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get User from args
      const username = args[0].toLowerCase();
      const user = User.load(username);

      // If User does not exist, return error message
      if (!user) {
        return reply(BOT_MESSAGES.USERNAME_NOT_FOUND(username), context);
      }

      // Generate unique path
      const path = generateImagePath();

      // Create HTML image with Table
      const imageCreated = await nodeHtmlToImage({
        output: path,
        html: tableForSubmissions(user),
      })
        .then(() => {
          log(SERVER_MESSAGES.IMAGE_WAS_CREATED(path));
          return true;
        })
        .catch((err) => {
          error(SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED(err));
          return false;
        });

      // If image was created
      if (imageCreated) {
        // Upload image to imgur and get link
        const imageLink = await imgur.uploadImages(
          [path],
          'File',
        )
          .then((images) => images[0].link)
          .catch((err) => {
            error(SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
            return false;
          });

        // If image link was not achieved from Imgur API
        if (!imageLink) return reply(BOT_MESSAGES.ERROR_ON_THE_SERVER, context);

        // Delete image after uploading to imgur
        deleteFile(path);

        // Add image to context
        context.photoUrl = imageLink;
        return reply('', context);
      }

      return reply(BOT_MESSAGES.ERROR_ON_THE_SERVER, context);
    },
  },
];

module.exports = { actions };
