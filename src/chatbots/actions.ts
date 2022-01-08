import dictionary from '../utils/dictionary';
import Cache from '../cache';
import constants from '../utils/constants';
import { CacheResponse } from '../cache/response.model';
import { User } from '../leetcode/models';

import { action } from './decorators';
import {
  Context, Button, RegisteredAction, VizapiResponse,
} from './models';
import {
  tableForSubmissions,
  compareMenu,
  createButtonsFromUsers,
  getCloseButton,
  solvedProblemsChart,
} from './utils';
import { ButtonContainerType } from './models/buttons.model';

const { SERVER_MESSAGES: SM, BOT_MESSAGES: BM } = dictionary;

export const registeredActions: RegisteredAction[] = [];

export const vizapiActions = {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
};

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return 'pong';
  }

  @action({ name: 'start' })
  static start(context: Context): string {
    return BM.WELCOME_TEXT(context.prefix);
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

    return BM.USER_LIST(message);
  }

  @action({ name: 'refresh' })
  static async refresh(context: Context): Promise<string> {
    // Force refreshing start
    Cache.database.isRefreshing = false;

    // Log that database started refresh
    await context.reply(BM.STARTED_REFRESH, context);

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

    // Handle case with /remove <username_or_password>
    if (password === '') {
      // Add Buttons with User List
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove', password: usernameOrPassword,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.USER_LIST_REMOVE;
    }

    // We know for sure now, this is username
    const username = usernameOrPassword;

    // Handle case with /remove <password>
    // Discord specific
    if (username === '') {
      // Add Buttons with User List
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove', password,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.USER_LIST_REMOVE;
    }

    await context.reply(
      BM.USERNAME_WILL_BE_DELETED(username),
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
      BM.DATABASE_WILL_BE_CLEARED,
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
    return BM.STATS_TEXT(context.provider, Cache);
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
          text: BM.CML_RATING,
          action: '/rating cml',
        }],
        buttonPerRow: 1,
        placeholder: 'Username',
        type: ButtonContainerType.SingleButton,
      }];

      return BM.RATING_TEXT(Cache.allUsers());
    }

    // Cumulative rating:
    // - Easy - 0.5 point
    // - Medium - 1.5 points
    // - Hard - 5 points
    if (type === 'cml') {
      // Add button to open Regular Rating
      context.options.buttons = [{
        buttons: [{
          text: BM.REGULAR_RATING,
          action: '/rating',
        }],
        buttonPerRow: 1,
        placeholder: 'Username',
        type: ButtonContainerType.SingleButton,
      }];

      return BM.CML_RATING_TEXT(Cache.allUsers());
    }

    // If type is not recognized
    return BM.INCORRECT_RATING_TYPE;
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
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.USER_LIST_PROFILES;
    }

    // Get User from username
    const user: User = Cache.loadUser(username);

    if (!user) return BM.USERNAME_NOT_FOUND(username);

    const submissionsButtion: Button = {
      text: `${constants.EMOJI.CLIPBOARD} Submissions`,
      action: `/submissions ${username}`,
    };

    const avatarButton: Button = {
      text: `${constants.EMOJI.PERSON} Avatar`,
      action: `/avatar ${username}`,
    };

    const problemsButton: Button = {
      text: `${constants.EMOJI.CHART} Problems`,
      action: `/problems ${username}`,
    };

    const ratingButton: Button = {
      text: `${constants.EMOJI.BACK_ARROW} Back to Profiles`,
      action: '/profile',
    };

    context.options.buttons = [{
      buttons: [submissionsButtion, avatarButton, problemsButton, ratingButton],
      buttonPerRow: 3,
      placeholder: 'User menu',
      type: ButtonContainerType.MultipleButtons,
    }];

    return BM.USER_TEXT(user);
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
        return BM.USER_AVATAR(user.username);
      }

      return BM.USERNAME_NOT_FOUND(username);
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({ action: 'avatar' }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return BM.USER_LIST_AVATARS;
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
      if (!user) return BM.USERNAME_NOT_FOUND(username);

      // Create HTML image with Table
      const response: VizapiResponse = (
        await vizapiActions.tableForSubmissions(user)
      );

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return BM.USER_RECENT_SUBMISSIONS(user.username);
      }

      // If error is because of User not having any submissions
      if (response.reason === SM.NO_SUBMISSIONS) {
        return response.error;
      }

      // If image link was not achieved from VizAPI
      return BM.ERROR_ON_THE_SERVER;
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({ action: 'submissions' }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return BM.USER_LIST_SUBMISSIONS;
  }

  @action({
    name: 'problems',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async problems(context: Context): Promise<string> {
    const username = context.args.get('username').value.toLowerCase();

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
      const user: User = Cache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return BM.USERNAME_NOT_FOUND(username);

      // Create HTML image with Table
      const response: VizapiResponse = (
        await vizapiActions.solvedProblemsChart(user)
      );

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return BM.USER_SOLVED_PROBLEMS_CHART(user.username);
      }

      // If image link was not achieved from VizAPI
      return BM.ERROR_ON_THE_SERVER;
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({ action: 'problems' }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return BM.USER_LIST_PROBLEMS;
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
    const first = (
      context.args.get('first_username').value.toLowerCase()
    );
    const second = (
      context.args.get('second_username').value.toLowerCase()
    );

    // Getting left User
    if (first === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({ action: 'compare' }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.SELECT_LEFT_USER;
    }

    // Getting right User
    if (second === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({ action: `compare ${first}` }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.SELECT_RIGHT_USER;
    }

    // Get Users from args
    const leftUser: User = Cache.loadUser(first);
    const rightUser: User = Cache.loadUser(second);

    if (!leftUser) {
      return BM.USERNAME_NOT_FOUND(first);
    }

    if (!rightUser) {
      return BM.USERNAME_NOT_FOUND(second);
    }

    const response: VizapiResponse = (
      await vizapiActions.compareMenu(leftUser, rightUser)
    );

    // If image was created
    if (response.link) {
      // Add image to context
      context.photoUrl = response.link;
      return BM.USERS_COMPARE(first, second);
    }

    // If image link was not achieved from VizAPI
    return BM.ERROR_ON_THE_SERVER;
  }
}
