import dictionary from '../utils/dictionary';
import Cache from '../cache';
import { log } from '../utils/helper';
import constants from '../utils/constants';
import { CacheResponse } from '../cache/response.model';
import { User } from '../leetcode/models';

import { Context, TableResponse } from './models';
import {
  tableForSubmissions, createUserListReplyMarkup, compareMenu,
} from './utils';

const actions = [
  {
    name: 'start',
    execute: (context: Context): Promise<string> => {
      const { reply } = context;
      return reply(
        dictionary.BOT_MESSAGES.WELCOME_TEXT(context.prefix),
        context,
      );
    },
  },
  {
    name: 'add',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // If no username is set, return exception
      if (args.length === 0) {
        return reply(
          dictionary.BOT_MESSAGES.AT_LEAST_1_USERNAME(context.prefix),
          context,
        );
      }

      // Variable to store text to return back to chat
      let userDetails = '';

      // Promise List with promises for adding users
      for (let i = 0; i < args.length; i++) {
        // Get username
        const username: string = args[i];

        // Get results of adding
        // eslint-disable-next-line no-await-in-loop
        const result: CacheResponse = await Cache.addUser(username);

        // Log result detail
        log(result.detail);

        userDetails += result.detail;
      }

      return reply(dictionary.BOT_MESSAGES.USER_LIST(userDetails), context);
    },
  },
  {
    name: 'refresh',
    execute: async (context: Context): Promise<string> => {
      const { reply } = context;
      return reply(dictionary.BOT_MESSAGES.STARTED_REFRESH, context)
        .then(async () => {
          const result: CacheResponse = await Cache.refreshUsers();
          return reply(result.detail, context);
        });
    },
  },
  {
    name: 'remove',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // Correct input for removing should be /rm <username> <master_password>
      // If length of args is not 2, return error message
      if (args.length !== 2) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get username and password from message
      const username: string = args[0].toLowerCase();
      const password: string = args[1];

      // If password is incorrect, return error message
      if (password !== constants.MASTER_PASSWORD) {
        return reply(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Send message, that user will be deleted
      return reply(
        dictionary.BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username),
        context,
      ).then(async () => {
        // Remove the user and send the result (success or failure)
        const result: CacheResponse = await Cache.removeUser(username);
        log(result.detail);
        return reply(result.detail, context);
      });
    },
  },
  {
    name: 'clear',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // Correct input for removing should be /clear <master_password>
      // If length of args is not 1, return error message
      if (args.length !== 1) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get password from message
      const password: string = args[0];

      // If password is incorrect, return error message
      if (password !== constants.MASTER_PASSWORD) {
        return reply(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Send message, that Database will be cleared
      return reply(dictionary.BOT_MESSAGES.DATABASE_WILL_BE_CLEARED, context)
        .then(async () => {
          // Remove all Users and send the result (success or failure)
          const result: CacheResponse = await Cache.clearUsers();
          log(result.detail);
          return reply(result.detail, context);
        });
    },
  },
  {
    name: 'stats',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // Correct input for removing should be /stats <master_password>
      // If length of args is not 1, return error message
      if (args.length !== 1) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get password from message
      const password: string = args[0];

      // If password is incorrect, return error message
      if (password !== constants.MASTER_PASSWORD) {
        return reply(dictionary.BOT_MESSAGES.PASSWORD_IS_INCORRECT, context);
      }

      // Send message with stats
      return reply(
        dictionary.BOT_MESSAGES.STATS_TEXT(context.provider, Cache),
        context,
      );
    },
  },
  {
    name: 'rating',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // If more than 1 User was sent
      if (args.length > 1) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // If 1 User was sent
      if (args.length === 1) {
        const username: string = args[0].toLowerCase();
        const user: User = Cache.loadUser(username);

        // If user does exist, return user data with reply markup
        if (user) {
          context.options.reply_markup = createUserListReplyMarkup({
            isOnlyHeader: true,
            header: `${constants.EMOJI.CARD_FILE_BOX} Rating`,
            command: '/rating',
          });

          return reply(dictionary.BOT_MESSAGES.USER_TEXT(user), context);
        }

        return reply(
          dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username),
          context,
        );
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: Cache.allUsers(),
        footer: `${constants.EMOJI.CROSS_MARK} Close`,
        command: '/rating',
      });

      return reply(
        dictionary.BOT_MESSAGES.RATING_TEXT(Cache.allUsers()),
        context,
      );
    },
  },
  {
    name: 'avatar',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // If incorrect number of args provided, return incorrect input
      if (args.length > 1) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // If 1 User was sent
      if (args.length === 1) {
        // Get User from args
        const username: string = args[0].toLowerCase();
        const user: User = Cache.loadUser(username);

        if (user) {
          // Add photo to context
          context.photoUrl = user.profile.userAvatar;
          return reply('', context);
        }

        return reply(
          dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username),
          context,
        );
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: Cache.allUsers(),
        footer: `${constants.EMOJI.CROSS_MARK} Close`,
        command: '/avatar',
      });

      // If 0 User was sent
      return reply(dictionary.BOT_MESSAGES.USER_LIST_AVATARS, context);
    },
  },
  {
    name: 'submissions',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // If incorrect number of args provided, return incorrect input
      if (args.length > 1) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // If 1 User was sent
      if (args.length === 1) {
        // Get User from args
        const username: string = args[0].toLowerCase();
        const user: User = Cache.loadUser(username);

        // If User does not exist, return error message
        if (!user) {
          return reply(
            dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username),
            context,
          );
        }

        // Create HTML image with Table
        const response: TableResponse = await tableForSubmissions(user);

        // If image was created
        if (response.link) {
          // Add image to context
          context.photoUrl = response.link;

          return reply('', context);
        }

        // If error is because of User not having any submissions
        if (response.reason === dictionary.SERVER_MESSAGES.NO_SUBMISSIONS) {
          return reply(response.error, context);
        }

        // If image link was not achieved from VizAPI
        return reply(dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER, context);
      }

      // If 0 User was sent, add reply markup context for User
      context.options.reply_markup = createUserListReplyMarkup({
        users: Cache.allUsers(),
        footer: `${constants.EMOJI.CROSS_MARK} Close`,
        command: '/submissions',
      });

      // If 0 User was sent
      return reply(dictionary.BOT_MESSAGES.USER_LIST_SUBMISSIONS, context);
    },
  },
  {
    name: 'compare',
    execute: async (context: Context): Promise<string> => {
      const { args, reply } = context;

      // If incorrect number of args provided, return incorrect input
      if (args.length !== 2) {
        return reply(dictionary.BOT_MESSAGES.INCORRECT_INPUT, context);
      }

      // Get Users from args
      const leftUsername: string = args[0].toLowerCase();
      const leftUser: User = Cache.loadUser(leftUsername);
      const rightUsername: string = args[1].toLowerCase();
      const rightUser: User = Cache.loadUser(rightUsername);

      if (!leftUser) {
        return reply(
          dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(leftUsername),
          context,
        );
      }

      if (!rightUser) {
        return reply(
          dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(rightUsername),
          context,
        );
      }

      const response: TableResponse = await compareMenu(leftUser, rightUser);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return reply('', context);
      }

      // If image link was not achieved from VizAPI
      return reply(dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER, context);
    },
  },
];

export default actions;
