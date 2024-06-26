import dictionary from '../utils/dictionary';
import Cache from '../cache';
import constants from '../utils/constants';
import { CacheResponse } from '../cache/response.model';
import { User } from '../leetcode/models';

import { action } from './decorators';
import { Context, TableResponse, ReplyMarkupCommand } from './models';
import {
  tableForSubmissions,
  compareMenu,
  generateReplyMarkup,
  createButtonsFromUsers,
} from './utils';

export const registeredActions = [];

export const vizapiActions = {
  tableForSubmissions,
  compareMenu,
};

export default class Actions {
  @action({ name: 'start', argsCount: [0] })
  static start(context: Context): string {
    return dictionary.BOT_MESSAGES.WELCOME_TEXT(context.prefix);
  }

  @action({ name: 'add', argsCount: '+' })
  static async add(context: Context, args: string[]): Promise<string> {
    // Variable to store text to return back to chat
    let userDetails = '';

    // Promise List with promises for adding users
    for (let i = 0; i < args.length; i++) {
      // Get username
      const username: string = args[i];

      // Get results of adding
      // eslint-disable-next-line no-await-in-loop
      const result: CacheResponse = await Cache.addUser(username);

      userDetails += result.detail;
    }

    return dictionary.BOT_MESSAGES.USER_LIST(userDetails);
  }

  @action({ name: 'refresh', argsCount: [0] })
  static async refresh(
    context: Context,
    args: string[],
    reply: (message: string, _: Context) => Promise<string>,
  ): Promise<string> {
    // Force refresh
    Cache.database.isRefreshing = false;

    await reply(dictionary.BOT_MESSAGES.STARTED_REFRESH, context);

    const result: CacheResponse = await Cache.refreshUsers();
    return result.detail;
  }

  @action({ name: 'remove', argsCount: [1, 2], isAdmin: true })
  static async remove(
    context: Context,
    args: string[],
    reply: (message: string, _: Context) => Promise<string>,
  ): Promise<string> {
    // Handle case with /remove <master_password>
    if (args.length === 0) {
      // Add Buttons with User List
      context.options.reply_markup = generateReplyMarkup({
        buttons: createButtonsFromUsers({
          action: 'remove', password: context.password,
        }),
        isClosable: true,
      });

      return dictionary.BOT_MESSAGES.USER_LIST_REMOVE;
    }

    // Get username from message
    const username: string = args[0].toLowerCase();

    await reply(
      dictionary.BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username),
      context,
    );

    // Remove User
    const result: CacheResponse = await Cache.removeUser(username);

    return result.detail;
  }

  @action({ name: 'clear', argsCount: [1], isAdmin: true })
  static async clear(
    context: Context,
    args: string[],
    reply: (message: string, _: Context) => Promise<string>,
  ): Promise<string> {
    // Send message, that Database will be cleared
    await reply(dictionary.BOT_MESSAGES.DATABASE_WILL_BE_CLEARED, context);

    // Remove all Users and send the result (success or failure)
    const result: CacheResponse = await Cache.clearUsers();

    return result.detail;
  }

  @action({ name: 'stats', argsCount: [1], isAdmin: true })
  static async stats(context: Context): Promise<string> {
    // Send message with stats
    return dictionary.BOT_MESSAGES.STATS_TEXT(context.provider, Cache);
  }

  @action({ name: 'rating', argsCount: [0] })
  static async rating(): Promise<string> {
    return dictionary.BOT_MESSAGES.RATING_TEXT(Cache.allUsers());
  }

  @action({ name: 'profile', argsCount: [0, 1] })
  static async profile(context: Context, args: string[]): Promise<string> {
    if (args.length === 0) {
      // Add user buttons
      context.options.reply_markup = generateReplyMarkup({
        buttons: createButtonsFromUsers({ action: 'profile' }),
        isClosable: true,
      });

      return dictionary.BOT_MESSAGES.USER_LIST_PROFILES;
    }

    // Get User from username
    const username: string = args[0].toLowerCase();
    const user: User = Cache.loadUser(username);

    if (!user) return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username);

    const submissionsButtion: ReplyMarkupCommand = {
      text: `${constants.EMOJI.CLIPBOARD} Submissions`,
      action: `/submissions ${username}`,
    };

    const avatarButton: ReplyMarkupCommand = {
      text: `${constants.EMOJI.PERSON} Avatar`,
      action: `/avatar ${username}`,
    };

    const ratingButton: ReplyMarkupCommand = {
      text: `${constants.EMOJI.BACK_ARROW} Back to Profiles`,
      action: '/profile',
    };

    context.options.reply_markup = generateReplyMarkup({
      buttons: [submissionsButtion, avatarButton, ratingButton],
    });

    return dictionary.BOT_MESSAGES.USER_TEXT(user);
  }

  @action({ name: 'avatar', argsCount: [0, 1] })
  static async avatar(context: Context, args: string[]): Promise<string> {
    // If 1 User was sent
    if (args.length === 1) {
      // Get User from args
      const username: string = args[0].toLowerCase();
      const user: User = Cache.loadUser(username);

      if (user) {
        // Add photo to context
        context.photoUrl = user.profile.userAvatar;
        return '';
      }

      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username);
    }

    // If 0 User was sent, add reply markup context for User
    context.options.reply_markup = generateReplyMarkup({
      buttons: createButtonsFromUsers({ action: 'avatar' }),
      isClosable: true,
    });

    // If 0 User was sent
    return dictionary.BOT_MESSAGES.USER_LIST_AVATARS;
  }

  @action({ name: 'submissions', argsCount: [0, 1] })
  static async submissions(context: Context, args: string[]): Promise<string> {
    // If 1 User was sent
    if (args.length === 1) {
      // Get User from args
      const username: string = args[0].toLowerCase();
      const user: User = Cache.loadUser(username);

      // If User does not exist, return error message
      if (!user) {
        return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username);
      }

      // Create HTML image with Table
      const response: TableResponse = (
        await vizapiActions.tableForSubmissions(user)
      );

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return '';
      }

      // If error is because of User not having any submissions
      if (response.reason === dictionary.SERVER_MESSAGES.NO_SUBMISSIONS) {
        return response.error;
      }

      // If image link was not achieved from VizAPI
      return dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER;
    }

    // If 0 User was sent, add reply markup context for User
    context.options.reply_markup = generateReplyMarkup({
      buttons: createButtonsFromUsers({ action: 'submissions' }),
      isClosable: true,
    });

    // If 0 User was sent
    return dictionary.BOT_MESSAGES.USER_LIST_SUBMISSIONS;
  }

  @action({ name: 'compare', argsCount: [0, 1, 2] })
  static async compare(context: Context, args: string[]): Promise<string> {
    // Getting left User
    if (args.length === 0) {
      context.options.reply_markup = generateReplyMarkup({
        buttons: createButtonsFromUsers({ action: 'compare' }),
        isClosable: true,
      });

      return dictionary.BOT_MESSAGES.SELECT_LEFT_USER;
    }

    // Getting right User
    if (args.length === 1) {
      const username: string = args[0].toLowerCase();

      context.options.reply_markup = generateReplyMarkup({
        buttons: createButtonsFromUsers({ action: `compare ${username}` }),
        isClosable: true,
      });

      return dictionary.BOT_MESSAGES.SELECT_RIGHT_USER;
    }

    // Get Users from args
    const leftUsername: string = args[0].toLowerCase();
    const leftUser: User = Cache.loadUser(leftUsername);
    const rightUsername: string = args[1].toLowerCase();
    const rightUser: User = Cache.loadUser(rightUsername);

    if (!leftUser) {
      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(leftUsername);
    }

    if (!rightUser) {
      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(rightUsername);
    }

    const response: TableResponse = (
      await vizapiActions.compareMenu(leftUser, rightUser)
    );

    // If image was created
    if (response.link) {
      // Add image to context
      context.photoUrl = response.link;

      return '';
    }

    // If image link was not achieved from VizAPI
    return dictionary.BOT_MESSAGES.ERROR_ON_THE_SERVER;
  }
}
