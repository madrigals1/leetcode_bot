import { SERVER_MESSAGES as SM, BOT_MESSAGES as BM } from '../utils/dictionary';
import { constants } from '../utils/constants';
import {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
  ratingGraph,
} from '../vizapi';
import { UserCache } from '../cache/userCache';
import { getLanguageStats } from '../leetcode';

import { action } from './decorators';
import {
  Context,
  Button,
  RegisteredAction,
  ButtonContainerType,
} from './models';
import { createButtonsFromUsers, getCloseButton } from './utils';
import SubscriptionTypeManager, {
  FullSubscriptionTypeModel,
} from './subscriptionTypeManager';

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
    return BM.WELCOME_TEXT(context.prefix);
  }

  @action({ name: 'help' })
  static help(): string {
    return BM.HELP_TEXT;
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

    return BM.USER_LIST(message);
  }

  @action({ name: 'refresh' })
  static async refresh(context: Context): Promise<string> {
    // Log that database started refresh
    await context.reply(BM.CACHE_STARTED_REFRESH, context);

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
      // Add Buttons with User List
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove',
          users: context.channelCache.users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.USER_LIST_REMOVE;
    }

    // Check if User exists
    const user = context.channelCache.loadUser(username);
    if (!user) return BM.USERNAME_NOT_FOUND(username);

    await context.reply(BM.USERNAME_WILL_BE_DELETED(username), context);

    // Remove User
    const result = await context.channelCache.removeUser(username);

    return result.detail;
  }

  @action({ name: 'clear', isAdmin: true })
  static async clear(context: Context): Promise<string> {
    // Send message, that Database will be cleared
    await context.reply(BM.CHANNEL_WILL_BE_CLEARED, context);

    // Remove all Users and send the result (success or failure)
    const result = await context.channelCache.clear();

    return result.detail;
  }

  @action({ name: 'stats', isAdmin: true })
  static async stats(context: Context): Promise<string> {
    const { users } = context.channelCache;

    // Send message with stats
    return BM.STATS_TEXT(context.provider, users);
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
        text: BM.CML_RATING,
        action: '/rating cml',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };
    const graphButton = {
      buttons: [{
        text: BM.GRAPH_RATING,
        action: '/rating graph',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };
    const regularButton = {
      buttons: [{
        text: BM.REGULAR_RATING,
        action: '/rating',
      }],
      buttonPerRow: 1,
      placeholder: 'Username',
      type: ButtonContainerType.SingleButton,
    };

    // Regular rating with "Problem Solved" count
    if (type === '') {
      // Add buttons
      context.options.buttons = [cmlButton, graphButton];

      return BM.RATING_TEXT(users);
    }

    // Cumulative rating:
    // - Easy - 0.5 point
    // - Medium - 1.5 points
    // - Hard - 5 points
    if (type === 'cml') {
      // Add buttons
      context.options.buttons = [regularButton, graphButton];

      return BM.CML_RATING_TEXT(users);
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
        context.options.buttons = [regularButton, cmlButton];

        return BM.GRAPH_RATING;
      }

      // If image link was not achieved from VizAPI
      return BM.ERROR_ON_THE_SERVER;
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
        buttons: createButtonsFromUsers({
          action: 'profile',
          users: context.channelCache.users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.USER_LIST_PROFILES;
    }

    // Get User from username
    const user = context.channelCache.loadUser(username);

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
      const user = context.channelCache.loadUser(username);

      if (user) {
        // Add photo to context
        context.photoUrl = user.profile.userAvatar;
        return BM.USER_AVATAR(user.username);
      }

      return BM.USERNAME_NOT_FOUND(username);
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'avatar',
        users: context.channelCache.users,
      }),
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
      const user = context.channelCache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return BM.USERNAME_NOT_FOUND(username);

      // Create HTML image with Table
      const response = await vizapiActions.tableForSubmissions(user);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        return BM.USER_RECENT_SUBMISSIONS(user.username);
      }

      // If error is because of User not having any submissions
      if (response.reason === SM.NO_SUBMISSIONS) return response.error;

      // If image link was not achieved from VizAPI
      return BM.ERROR_ON_THE_SERVER;
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'submissions',
        users: context.channelCache.users,
      }),
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
      const user = context.channelCache.loadUser(username);

      // If User does not exist, return error message
      if (!user) return BM.USERNAME_NOT_FOUND(username);

      // Create HTML image with Table
      const response = await vizapiActions.solvedProblemsChart(user);

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
      buttons: createButtonsFromUsers({
        action: 'problems',
        users: context.channelCache.users,
      }),
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
    const first = context.args.get('first_username').value.toLowerCase();
    const second = context.args.get('second_username').value.toLowerCase();

    // Getting left User
    if (first === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'compare',
          users: context.channelCache.users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.SELECT_LEFT_USER;
    }

    // Getting right User
    if (second === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: `compare ${first}`,
          users: context.channelCache.users,
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return BM.SELECT_RIGHT_USER;
    }

    // Get Users from args
    const leftUser = context.channelCache.loadUser(first);
    const rightUser = context.channelCache.loadUser(second);

    if (!leftUser) {
      return BM.USERNAME_NOT_FOUND(first);
    }

    if (!rightUser) {
      return BM.USERNAME_NOT_FOUND(second);
    }

    const response = await vizapiActions.compareMenu(leftUser, rightUser);

    // If image was created
    if (response.link) {
      // Add image to context
      context.photoUrl = response.link;
      return BM.USERS_COMPARE(first, second);
    }

    // If image link was not achieved from VizAPI
    return BM.ERROR_ON_THE_SERVER;
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
      if (!user) return BM.USERNAME_NOT_FOUND(username);

      // Get language stats from LeetCode
      const response = await leetcodeActions.getLanguageStats(username);
      const data = response?.matchedUser?.languageProblemCount ?? [];

      return BM.LANGUAGE_STATS_TEXT(username, data);
    }

    // If 0 User was sent, add reply markup context for User
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'langstats',
        users: context.channelCache.users,
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
    return BM.USER_LIST_LANGSTATS;
  }

  @action({
    name: 'subscribe',
    args: [
      {
        key: 'subscription_type',
        name: 'Subscription Type',
        index: 0,
        isRequired: false,
      },
    ],
    isAdmin: true,
  })
  static async subscribe(context: Context): Promise<string> {
    const subscriptionTypeKey = context.args.get('subscription_type').value;
    const subscriptionType = SubscriptionTypeManager
      .getType(subscriptionTypeKey);

    // If Subscription Type was sent
    if (subscriptionTypeKey !== '') {
      // Subscribe
      const result = await context.channelCache.subscribe(subscriptionType);

      return result.detail;
    }

    // If Subscription Type was not sent, return buttons
    context.options.buttons = [{
      buttons: SubscriptionTypeManager.getAll()
        .map((subscriptionTypeModel: FullSubscriptionTypeModel) => ({
          text: subscriptionTypeModel.humanName,
          action: `/subscribe ${subscriptionTypeModel.key}`,
        })),
      buttonPerRow: 3,
      placeholder: 'Subscription Type',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    return BM.SUBSCRIPTION_LIST;
  }

  @action({
    name: 'unsubscribe',
    args: [
      {
        key: 'subscription_type',
        name: 'Subscription Type',
        index: 0,
        isRequired: false,
      },
    ],
    isAdmin: true,
  })
  static async unsubscribe(context: Context): Promise<string> {
    const subscriptionTypeKey = context.args.get('subscription_type').value;
    const subscriptionType = SubscriptionTypeManager
      .getType(subscriptionTypeKey);

    // If Subscription Type was sent
    if (subscriptionTypeKey !== '') {
      // Unsubscribe
      const result = await context.channelCache.unsubscribe(subscriptionType);

      return result.detail;
    }

    // If Subscription Type was not sent, return buttons
    context.options.buttons = [{
      buttons: SubscriptionTypeManager.getAll()
        .map((subscriptionTypeModel: FullSubscriptionTypeModel) => ({
          text: subscriptionTypeModel.humanName,
          action: `/unsubscribe ${subscriptionTypeModel.key}`,
        })),
      buttonPerRow: 3,
      placeholder: 'Subscription Type',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    return BM.UNSUBSCRIPTION_LIST;
  }

  @action({ name: 'subscription', isAdmin: true })
  static async subscription(context: Context): Promise<string> {
    const subscriptions = await context.channelCache
      .getAllSubscriptions(context.channelKey);

    return SubscriptionTypeManager.getSubscriptionsText(subscriptions);
  }
}
