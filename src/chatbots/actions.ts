import dictionary from '../utils/dictionary';
import Cache from '../cache';
import constants from '../utils/constants';
import { CacheResponse } from '../cache/response.model';
import { User } from '../leetcode/models';

import { action } from './decorators';
import {
  Context, TableResponse, Button, RegisteredAction,
} from './models';
import {
  tableForSubmissions,
  compareMenu,
  createButtonsFromUsers,
  getCloseButton,
} from './utils';

export const registeredActions: RegisteredAction[] = [];

export const vizapiActions = {
  tableForSubmissions,
  compareMenu,
};

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return 'pong';
  }

  @action({ name: 'start' })
  static start(context: Context): string {
    return dictionary.BOT_MESSAGES.WELCOME_TEXT(context.prefix);
  }

  @action({
    name: 'add',
    args: [
      {
        key: 'username',
        name: 'Username(s)',
        index: 0,
        isRequired: true,
        isMultiple: true,
      },
    ],
  })
  static async add(context: Context): Promise<string> {
    // Variable to store text to return back to chat
    let message = '';

    // Get Usernames from arguments
    const usernames = context.args.get('username').values;

    // Add all Users 1 by 1 and log into message
    for (let i = 0; i < usernames.length; i++) {
      // Get results of adding
      // eslint-disable-next-line no-await-in-loop
      const result: CacheResponse = await Cache.addUser(usernames[i]);

      message += result.detail;
    }

    return dictionary.BOT_MESSAGES.USER_LIST(message);
  }

  @action({ name: 'refresh' })
  static async refresh(context: Context): Promise<string> {
    // Force refreshing start
    Cache.database.isRefreshing = false;

    // Log that database started refresh
    await context.reply(dictionary.BOT_MESSAGES.STARTED_REFRESH, context);

    // Refresh and return result
    const result: CacheResponse = await Cache.refreshUsers();
    return result.detail;
  }

  @action({
    name: 'remove',
    args: [
      {
        key: 'username_or_password',
        name: 'Username or Password',
        index: 0,
        isRequired: false,
      },
      {
        key: 'password',
        name: 'Password',
        index: 1,
        isRequired: false,
      },
    ],
    isAdmin: true,
  })
  static async remove(context: Context): Promise<string> {
    const usernameOrPassword = context.args.get('username_or_password').value;
    const password = context.args.get('password').value;

    // Handle case with /remove <master_password>
    if (password === '') {
      // Add Buttons with User List
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove', password: usernameOrPassword,
        }),
        buttonPerRow: 3,
      }, getCloseButton()];

      return dictionary.BOT_MESSAGES.USER_LIST_REMOVE;
    }

    // We know for sure now, this is username
    const username = usernameOrPassword;

    await context.reply(
      dictionary.BOT_MESSAGES.USERNAME_WILL_BE_DELETED(username),
      context,
    );

    // Remove User
    const result: CacheResponse = await Cache.removeUser(username);

    return result.detail;
  }

  @action({
    name: 'clear',
    args: [
      {
        key: 'password',
        name: 'Password',
        index: 0,
        isRequired: true,
      },
    ],
    isAdmin: true,
  })
  static async clear(context: Context): Promise<string> {
    // Send message, that Database will be cleared
    await context.reply(
      dictionary.BOT_MESSAGES.DATABASE_WILL_BE_CLEARED,
      context,
    );

    // Remove all Users and send the result (success or failure)
    const result: CacheResponse = await Cache.clearUsers();

    return result.detail;
  }

  @action({
    name: 'stats',
    args: [
      {
        key: 'password',
        name: 'Password',
        index: 0,
        isRequired: true,
      },
    ],
    isAdmin: true,
  })
  static async stats(context: Context): Promise<string> {
    // Send message with stats
    return dictionary.BOT_MESSAGES.STATS_TEXT(context.provider, Cache);
  }

  @action({
    name: 'rating',
    args: [
      {
        key: 'type',
        name: 'Type',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async rating(context: Context): Promise<string> {
    const type = context.args.get('type').value;

    // Regular rating with "Problem Solved" count
    if (type === '') {
      // Add button to open Cumulative Rating
      context.options.buttons = [{
        buttons: [{
          text: dictionary.BOT_MESSAGES.CML_RATING,
          action: '/rating cml',
        }],
        buttonPerRow: 1,
      }];

      return dictionary.BOT_MESSAGES.RATING_TEXT(Cache.allUsers());
    }

    // Cumulative rating:
    // - Easy - 1 point
    // - Medium - 2 points
    // - Hard - 3 points
    if (type === 'cml') {
      const usersWithCmlRating = Cache.allUsers().sort((user1, user2) => {
        const cml1 = user1.computed.problemsSolved.cumulative;
        const cml2 = user2.computed.problemsSolved.cumulative;
        return cml2 - cml1;
      });

      // Add button to open Regular Rating
      context.options.buttons = [{
        buttons: [{
          text: dictionary.BOT_MESSAGES.REGULAR_RATING,
          action: '/rating',
        }],
        buttonPerRow: 1,
      }];

      return dictionary.BOT_MESSAGES.CML_RATING_TEXT(usersWithCmlRating);
    }

    // Fallback to incorrect input
    return dictionary.BOT_MESSAGES.INCORRECT_INPUT;
  }

  @action({
    name: 'profile',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async profile(context: Context): Promise<string> {
    const username = context.args.get('username').value.toLowerCase();

    if (username === '') {
      // Add user buttons
      context.options.buttons = [{
        buttons: createButtonsFromUsers({ action: 'profile' }),
        buttonPerRow: 3,
      }, getCloseButton()];

      return dictionary.BOT_MESSAGES.USER_LIST_PROFILES;
    }

    // Get User from username
    const user: User = Cache.loadUser(username);

    if (!user) return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username);

    const submissionsButtion: Button = {
      text: `${constants.EMOJI.CLIPBOARD} Submissions`,
      action: `/submissions ${username}`,
    };

    const avatarButton: Button = {
      text: `${constants.EMOJI.PERSON} Avatar`,
      action: `/avatar ${username}`,
    };

    const ratingButton: Button = {
      text: `${constants.EMOJI.BACK_ARROW} Back to Profiles`,
      action: '/profile',
    };

    context.options.buttons = [{
      buttons: [submissionsButtion, avatarButton, ratingButton],
      buttonPerRow: 3,
    }];

    return dictionary.BOT_MESSAGES.USER_TEXT(user);
  }

  @action({
    name: 'avatar',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async avatar(context: Context): Promise<string> {
    const username = context.args.get('username').value.toLowerCase();

    // If 1 User was sent
    if (username !== '') {
      const user: User = Cache.loadUser(username);

      if (user) {
        // Add photo to context
        context.photoUrl = user.profile.userAvatar;
        return '';
      }

      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(username);
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({ action: 'avatar' }),
      buttonPerRow: 3,
    }, getCloseButton()];

    // If 0 User was sent
    return dictionary.BOT_MESSAGES.USER_LIST_AVATARS;
  }

  @action({
    name: 'submissions',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async submissions(context: Context): Promise<string> {
    const username = context.args.get('username').value.toLowerCase();

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
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
    context.options.buttons = [{
      buttons: createButtonsFromUsers({ action: 'submissions' }),
      buttonPerRow: 3,
    }, getCloseButton()];

    // If 0 User was sent
    return dictionary.BOT_MESSAGES.USER_LIST_SUBMISSIONS;
  }

  @action({
    name: 'compare',
    args: [
      {
        key: 'first_username',
        name: 'First Username',
        index: 0,
        isRequired: false,
      },
      {
        key: 'second_username',
        name: 'Second Username',
        index: 1,
        isRequired: false,
      },
    ],
  })
  static async compare(context: Context): Promise<string> {
    const firstUsername = (
      context.args.get('first_username').value.toLowerCase()
    );
    const secondUsername = (
      context.args.get('second_username').value.toLowerCase()
    );

    // Getting left User
    if (firstUsername === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({ action: 'compare' }),
        buttonPerRow: 3,
      }, getCloseButton()];

      return dictionary.BOT_MESSAGES.SELECT_LEFT_USER;
    }

    // Getting right User
    if (secondUsername === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({ action: `compare ${firstUsername}` }),
        buttonPerRow: 3,
      }, getCloseButton()];

      return dictionary.BOT_MESSAGES.SELECT_RIGHT_USER;
    }

    // Get Users from args
    const leftUser: User = Cache.loadUser(firstUsername);
    const rightUser: User = Cache.loadUser(secondUsername);

    if (!leftUser) {
      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(firstUsername);
    }

    if (!rightUser) {
      return dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(secondUsername);
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
