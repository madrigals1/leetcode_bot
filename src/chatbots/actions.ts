import { constants } from '../utils/constants';
import {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
  ratingGraph,
} from '../vizapi';
import { UserCache } from '../cache/userCache';
import { getLanguageStats } from '../leetcode';
import {
  BigMessages,
  RefreshMessages,
  SmallMessages,
  ListMessages,
  UserMessages,
  ChannelMessages,
  RatingMessages,
  ErrorMessages,
} from '../global/messages';

import { action } from './decorators';
import {
  Context, Button, RegisteredAction, ButtonContainerType,
} from './models';
import { createButtonsFromUsers, getCloseButton } from './utils';

export const registeredActions: RegisteredAction[] = [];

export const vizapiActions = {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
  ratingGraph,
};

export const leetcodeActions = {
  getLanguageStats,
};

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return 'pong';
  }

  @action({ name: 'start' })
  static start(context: Context): string {
    return BigMessages.welcomeText(context.prefix);
  }

  @action({ name: 'help' })
  static help(): string {
    return SmallMessages.helpText;
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
      const result = await context.channelCache.addUser(usernames[i]);

      message += result.detail;
    }

    return BigMessages.userListText(message);
  }

  @action({ name: 'refresh' })
  static async refresh(context: Context): Promise<string> {
    // Log that database started refresh
    await context.reply(RefreshMessages.cacheRefreshWasRequested, context);

    // Refresh and return result
    const result = await UserCache.refresh();
    return result.detail;
  }

  @action({
    name: 'remove',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
    isAdmin: true,
  })
  static async remove(context: Context): Promise<string> {
    const username = context.args.get('username').value;

    // If Username is not provided, show buttons
    if (username === '') {
      const { users } = context.channelCache;

      if (users.length === 0) {
        return SmallMessages.noUsers;
      }

      // If no username was sent, show buttons for each username in channel
      // to pick from
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove',
          users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return ListMessages.userListRemove;
    }

    // Check if User exists
    const user = context.channelCache.loadUser(username);
    if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

    await context.reply(UserMessages.userWillBeDeleted(username), context);

    // Remove User
    const result = await context.channelCache.removeUser(username);

    return result.detail;
  }

  @action({ name: 'clear', isAdmin: true })
  static async clear(context: Context): Promise<string> {
    // Send message, that Database will be cleared
    await context.reply(ChannelMessages.channelWillBeCleared, context);

    // Remove all Users and send the result (success or failure)
    const result = await context.channelCache.clear();

    return result.detail;
  }

  @action({ name: 'stats', isAdmin: true })
  static async stats(context: Context): Promise<string> {
    const { users } = context.channelCache;

    // Send message with stats
    return BigMessages.statsText(context.provider, users);
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
    const users = context.channelCache?.users ?? [];

    // Prepare buttons
    const cmlButton = {
      buttons: [{
        text: RatingMessages.cmlRating,
        action: '/rating cml',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };
    const graphButton = {
      buttons: [{
        text: RatingMessages.graphRating,
        action: '/rating graph',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };
    const contestButton = {
      buttons: [{
        text: RatingMessages.contestRating,
        action: '/rating contest',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };
    const regularButton = {
      buttons: [{
        text: RatingMessages.regularRating,
        action: '/rating',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };

    // Regular rating with "Problem Solved" count
    if (type === '') {
      // Add buttons
      context.options.buttons = [cmlButton, graphButton, contestButton];

      return BigMessages.ratingText(users);
    }

    // Cumulative rating:
    // - Easy - 0.5 point
    // - Medium - 1.5 points
    // - Hard - 5 points
    if (type === 'cml') {
      // Add buttons
      context.options.buttons = [regularButton, graphButton, contestButton];

      return BigMessages.cmlRatingText(users);
    }

    // Rating with graph
    if (type === 'graph') {
      // Create HTML image with Graph
      const response = await vizapiActions.ratingGraph(users);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        // Add buttons
        context.options.buttons = [regularButton, cmlButton, contestButton];

        return RatingMessages.graphRating;
      }

      // If image link was not achieved from VizAPI
      return ErrorMessages.server();
    }

    // Contest Rating
    if (type === 'contest') {
      // Add buttons
      context.options.buttons = [regularButton, cmlButton, graphButton];

      return BigMessages.contestRatingText(users);
    }

    // If type is not recognized
    return RatingMessages.incorrectRatingType;
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
      const { users } = context.channelCache;

      if (users.length === 0) {
        return SmallMessages.noUsers;
      }

      // If no username was sent, show buttons for each username in channel
      // to pick from
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'profile',
          users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return ListMessages.userListProfiles;
    }

    // Get User from username
    const user = context.channelCache.loadUser(username);

    if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

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

    return BigMessages.userText(user);
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
      const user = context.channelCache.loadUser(username);

      if (user) {
        // Add photo to context
        context.photoUrl = user.profile.userAvatar;
        return UserMessages.usersAvatar(user.username);
      }

      return UserMessages.userDoesNotExistInThisChannel(username);
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return SmallMessages.noUsers;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'avatar',
        users,
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return ListMessages.userListAvatars;
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
      const user = context.channelCache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

      // Create HTML image with Table
      const response = await vizapiActions.tableForSubmissions(user);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return UserMessages.usersRecentSubmissions(user.username);
      }

      // If error is because of User not having any submissions
      if (response.reason === SmallMessages.noSubmissions) {
        return response.error;
      }

      // If image link was not achieved from VizAPI
      return ErrorMessages.server();
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return SmallMessages.noUsers;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'submissions',
        users,
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return ListMessages.userListSubmissions;
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
      const user = context.channelCache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

      // Create HTML image with Table
      const response = await vizapiActions.solvedProblemsChart(user);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return UserMessages.usersSolvedProblemsChart(user.username);
      }

      // If image link was not achieved from VizAPI
      return ErrorMessages.server();
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return SmallMessages.noUsers;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'problems',
        users,
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return ListMessages.userListProblems;
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
    const first = context.args.get('first_username').value.toLowerCase();
    const second = context.args.get('second_username').value.toLowerCase();

    const { users } = context.channelCache;

    if (users.length === 0) {
      return SmallMessages.noUsers;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    if (first === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'compare',
          users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return UserMessages.selectLeftUser;
    }

    // Getting right User
    if (second === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: `compare ${first}`,
          users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return UserMessages.selectRightUser;
    }

    // Get Users from args
    const leftUser = context.channelCache.loadUser(first);
    const rightUser = context.channelCache.loadUser(second);

    if (!leftUser) {
      return UserMessages.userDoesNotExistInThisChannel(first);
    }

    if (!rightUser) {
      return UserMessages.userDoesNotExistInThisChannel(second);
    }

    const response = await vizapiActions.compareMenu(leftUser, rightUser);

    // If image was created
    if (response.link) {
      // Add image to context
      context.photoUrl = response.link;
      return UserMessages.compareUsers(first, second);
    }

    // If image link was not achieved from VizAPI
    return ErrorMessages.server();
  }

  @action({
    name: 'langstats',
    args: [
      {
        key: 'username',
        name: 'Username',
        index: 0,
        isRequired: false,
      },
    ],
  })
  static async langstats(context: Context): Promise<string> {
    const username = context.args.get('username').value.toLowerCase();

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
      const user = context.channelCache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

      // Get language stats from LeetCode
      const response = await leetcodeActions.getLanguageStats(username);
      const data = response?.matchedUser?.languageProblemCount ?? [];

      return BigMessages.languageStatsText(username, data);
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return SmallMessages.noUsers;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'langstats',
        users,
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return ListMessages.userListLangstats;
  }
}
