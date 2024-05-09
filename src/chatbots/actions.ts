<<<<<<< HEAD
=======
import { constants } from '../global/constants';
>>>>>>> master
import {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
  ratingGraph,
} from '../vizapi';
<<<<<<< HEAD
import ApiService from '../backend/apiService';
import { log } from '../utils/helper';
import {
  UserAddMessages,
  UserDeleteMessages,
  UserMessages,
  BigMessages,
  SmallMessages,
  RefreshMessages,
  ClearMessages,
  RatingMessages,
  ErrorMessages,
  ListMessages,
  SubscriptionMessages,
} from '../globals/messages';
=======
import { UserCache } from '../cache/userCache';
import { getLanguageStats } from '../leetcode';
import {
  BigMessages,
  RefreshMessages,
  UserMessages,
  ChannelMessages,
  RatingMessages,
  ErrorMessages,
} from '../global/messages';
>>>>>>> master

import { action, admin } from './decorators';
import {
  Context,
  Button,
  RegisteredAction,
  ButtonContainerType,
} from './models';
import { createButtonsFromUsers, getCloseButton } from './utils';
import {
  FullSubscriptionTypeModel,
  subscriptionTypeManager,
} from './subscriptionTypeManager';

export const registeredActions: RegisteredAction[] = [];

export const vizapiActions = {
  tableForSubmissions,
  compareMenu,
  solvedProblemsChart,
  ratingGraph,
};

export default class Actions {
  @action({ name: 'ping' })
  static ping(): string {
    return SmallMessages.pong;
  }

  @action({ name: 'start' })
  static start(context: Context): string {
    return BigMessages.welcomeText(context.prefix);
  }

  @action({ name: 'help' })
  static help(): string {
<<<<<<< HEAD
    return SmallMessages.helpText;
=======
    return BigMessages.helpText;
>>>>>>> master
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
    // Get Usernames from arguments
    const usernames = context.args.get('username').values;

    // Add users to Database and return response as string
    const response = await ApiService
      .bulkAddUsersToChannel(context.channelId, usernames)
      .catch((err) => {
        log(err);
        return [];
      });

<<<<<<< HEAD
    return UserAddMessages.userList(response);
=======
      message += result.detail;
    }

    return BigMessages.userListText(message);
>>>>>>> master
  }

  @action({ name: 'refresh' })
  static async refresh(context: Context): Promise<string> {
    // Log that database started refresh
<<<<<<< HEAD
    await context.reply(RefreshMessages.startedRefresh, context);
=======
    await context.reply(RefreshMessages.cacheRefreshWasRequested, context);
>>>>>>> master

    await ApiService.refreshChannel(context.channelId);
    return RefreshMessages.isRefreshed;
  }

  @admin()
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
  })
  static async remove(context: Context): Promise<string> {
    const username = context.args.get('username').value;

    // If Username is not provided, show buttons
    if (username === '') {
<<<<<<< HEAD
      const lbbUsers = await ApiService.fetchUsersForChannel(context.channelId);

      // Add Buttons with User List
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove',
          users: lbbUsers.map((user) => user.data),
=======
      const { users } = context.channelCache;

      if (users.length === 0) {
        return ErrorMessages.noUsersFoundInDatabase;
      }

      // If no username was sent, show buttons for each username in channel
      // to pick from
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'remove',
          users,
>>>>>>> master
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

<<<<<<< HEAD
      return ListMessages.userListRemove;
    }

    // Check if User exists
    const user = await ApiService
      .findUserInChannel(context.channelId, username);

    if (!user) return UserMessages.doesNotExist(username);

    const message = UserDeleteMessages.willBeDeleted(username);
    await context.reply(message, context);
=======
      return UserMessages.userListRemove;
    }

    // Check if User exists
    const user = context.channelCache.loadUser(username);
    if (!user) return UserMessages.userDoesNotExistInThisChannel(username);

    await context.reply(UserMessages.userWillBeDeleted(username), context);
>>>>>>> master

    // Remove User
    const result = await ApiService
      .deleteUserFromChannelByUsername(context.channelId, username);

    return UserDeleteMessages[result.detail](username);
  }

  @admin()
  @action({ name: 'clear' })
  static async clear(context: Context): Promise<string> {
    // Send message, that Database will be cleared
<<<<<<< HEAD
    await context.reply(ClearMessages.channelWillBeCleared, context);
=======
    await context.reply(ChannelMessages.channelWillBeCleared, context);
>>>>>>> master

    // Remove all Users and send the result (success or failure)
    const result = await ApiService.clearChannel(context.channelId);

    return result
      ? ClearMessages.channelWasCleared
      : ClearMessages.channelWasNotCleared;
  }

  @admin()
  @action({ name: 'stats' })
  static async stats(context: Context): Promise<string> {
    const lbbUsers = await ApiService.fetchUsersForChannel(context.channelId);
    const users = lbbUsers.map((lbbUser) => lbbUser.data);

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
    const lbbUsersPromise = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

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
<<<<<<< HEAD
      context.options.buttons = [cmlButton, graphButton];
      return BigMessages.ratingText(await lbbUsersPromise);
=======
      context.options.buttons = [cmlButton, graphButton, contestButton];

      return BigMessages.ratingText(users);
>>>>>>> master
    }

    // Cumulative rating:
    // - Easy - 0.5 point
    // - Medium - 1.5 points
    // - Hard - 5 points
    if (type === 'cml') {
      // Add buttons
<<<<<<< HEAD
      context.options.buttons = [regularButton, graphButton];
      const cmlUsersPromise = ApiService
        .fetchUsersForChannel(context.channelId, '-solved_cml')
        .then((users) => users.map((user) => user.data))
        .catch((err) => {
          log(err);
          return [];
        });
      return BigMessages.cmlRatingText(await cmlUsersPromise);
=======
      context.options.buttons = [regularButton, graphButton, contestButton];

      return BigMessages.cmlRatingText(users);
>>>>>>> master
    }

    // Rating with graph
    if (type === 'graph') {
      // Create HTML image with Graph
      const response = await vizapiActions.ratingGraph(await lbbUsersPromise);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;

        // Add buttons
        context.options.buttons = [regularButton, cmlButton, contestButton];

        return RatingMessages.graphRating;
      }

      // If image link was not achieved from VizAPI
<<<<<<< HEAD
      return ErrorMessages.server;
    }

    // If type is not recognized
    return RatingMessages.incorrectRatingType;
=======
      return ErrorMessages.errorOnTheServer();
    }

    // Contest Rating
    if (type === 'contest') {
      // Add buttons
      context.options.buttons = [regularButton, cmlButton, graphButton];

      return BigMessages.contestRatingText(users);
    }

    // If type is not recognized
    return ErrorMessages.incorrectRatingType;
>>>>>>> master
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
    const lbbUsersPromise = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    if (username === '') {
      const { users } = context.channelCache;

      if (users.length === 0) {
        return ErrorMessages.noUsersFoundInDatabase;
      }

      // If no username was sent, show buttons for each username in channel
      // to pick from
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'profile',
<<<<<<< HEAD
          users: await lbbUsersPromise,
=======
          users,
>>>>>>> master
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

<<<<<<< HEAD
      return ListMessages.userListProfiles;
=======
      return UserMessages.userListProfiles;
>>>>>>> master
    }

    // Get User from username
    const user = await ApiService
      .findUserInChannel(context.channelId, username);

<<<<<<< HEAD
    if (!user) return UserMessages.doesNotExist(username);
=======
    if (!user) return UserMessages.userDoesNotExistInThisChannel(username);
>>>>>>> master

    const submissionsButtion: Button = {
      text: ListMessages.userListSubmissions,
      action: `/submissions ${username}`,
    };

    const avatarButton: Button = {
      text: UserMessages.avatar,
      action: `/avatar ${username}`,
    };

    const problemsButton: Button = {
      text: ListMessages.userListProblems,
      action: `/problems ${username}`,
    };

    const ratingButton: Button = {
      text: ListMessages.backToProfiles,
      action: '/profile',
    };

    context.options.buttons = [{
      buttons: [submissionsButtion, avatarButton, problemsButton, ratingButton],
      buttonPerRow: 3,
      placeholder: 'User menu',
      type: ButtonContainerType.MultipleButtons,
    }];

<<<<<<< HEAD
    return BigMessages.userText(user.data);
=======
    return BigMessages.userProfileText(user);
>>>>>>> master
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
    const lbbUsers = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    // If 1 User was sent
    if (username !== '') {
      const user = await ApiService
        .findUserInChannel(context.channelId, username);

<<<<<<< HEAD
      if (!user) return UserMessages.doesNotExist(username);

      // Add photo to context
      context.photoUrl = user.data.profile.userAvatar;
      return UserMessages.usernamesAvatar(username);
=======
      if (user) {
        // Add photo to context
        context.photoUrl = user.profile.userAvatar;
        return UserMessages.usersAvatar(user.username);
      }

      return UserMessages.userDoesNotExistInThisChannel(username);
>>>>>>> master
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return ErrorMessages.noUsersFoundInDatabase;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'avatar',
<<<<<<< HEAD
        users: await lbbUsers,
=======
        users,
>>>>>>> master
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
<<<<<<< HEAD
    return ListMessages.userListAvatars;
=======
    return UserMessages.userListAvatars;
>>>>>>> master
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
    const lbbUsers = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
      const user = await ApiService
        .findUserInChannel(context.channelId, username);

      // If User does not exist, return error message
<<<<<<< HEAD
      if (!user) return UserMessages.doesNotExist(username);
=======
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);
>>>>>>> master

      // Create HTML image with Table
      const response = await vizapiActions.tableForSubmissions(user.data);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;
<<<<<<< HEAD
        return UserMessages.recentSubmissions(username);
      }

      // If error is because of User not having any submissions
      if (response.reason === SmallMessages.noSubmissionsKey) {
=======

        return UserMessages.usersRecentSubmissions(user.username);
      }

      // If error is because of User not having any submissions
      if (response.reason === 'no_submissions') {
>>>>>>> master
        return response.error;
      }

      // If image link was not achieved from VizAPI
<<<<<<< HEAD
      return ErrorMessages.server;
=======
      return ErrorMessages.errorOnTheServer();
>>>>>>> master
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return ErrorMessages.noUsersFoundInDatabase;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'submissions',
<<<<<<< HEAD
        users: await lbbUsers,
=======
        users,
>>>>>>> master
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
<<<<<<< HEAD
    return ListMessages.userListSubmissions;
=======
    return UserMessages.userListSubmissions;
>>>>>>> master
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
    const lbbUsers = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
      const user = await ApiService
        .findUserInChannel(context.channelId, username);

      // If User does not exist, return error message
<<<<<<< HEAD
      if (!user) return UserMessages.doesNotExist(username);
=======
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);
>>>>>>> master

      // Create HTML image with Table
      const response = await vizapiActions.solvedProblemsChart(user.data);

      // If image was created
      if (response.link) {
        // Add image to context
        context.photoUrl = response.link;
<<<<<<< HEAD
        return UserMessages.solvedProblemsChart(username);
      }

      // If image link was not achieved from VizAPI
      return ErrorMessages.server;
=======

        return UserMessages.usersSolvedProblemsChart(user.username);
      }

      // If image link was not achieved from VizAPI
      return ErrorMessages.errorOnTheServer();
>>>>>>> master
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return ErrorMessages.noUsersFoundInDatabase;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'problems',
<<<<<<< HEAD
        users: await lbbUsers,
=======
        users,
>>>>>>> master
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
<<<<<<< HEAD
    return ListMessages.userListProblems;
=======
    return UserMessages.userListProblems;
>>>>>>> master
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
    const lbbUsers = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    const { users } = context.channelCache;

    if (users.length === 0) {
      return ErrorMessages.noUsersFoundInDatabase;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    if (first === '') {
      context.options.buttons = [{
        buttons: createButtonsFromUsers({
          action: 'compare',
<<<<<<< HEAD
          users: await lbbUsers,
=======
          users,
>>>>>>> master
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
<<<<<<< HEAD
          users: await lbbUsers,
=======
          users,
>>>>>>> master
        }),
        buttonPerRow: 3,
        placeholder: 'Username',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return UserMessages.selectRightUser;
    }

    // Get Users from args
    const leftUser = await ApiService
      .findUserInChannel(context.channelId, first);
    const rightUser = await ApiService
      .findUserInChannel(context.channelId, second);

    if (!leftUser) {
<<<<<<< HEAD
      return UserMessages.doesNotExist(first);
    }

    if (!rightUser) {
      return UserMessages.doesNotExist(second);
=======
      return UserMessages.userDoesNotExistInThisChannel(first);
    }

    if (!rightUser) {
      return UserMessages.userDoesNotExistInThisChannel(second);
>>>>>>> master
    }

    const response = await vizapiActions
      .compareMenu(leftUser.data, rightUser.data);

    // If image was created
    if (response.link) {
      // Add image to context
      context.photoUrl = response.link;
<<<<<<< HEAD
      return UserMessages.compare(first, second);
    }

    // If image link was not achieved from VizAPI
    return ErrorMessages.server;
=======
      return UserMessages.compareUsers(first, second);
    }

    // If image link was not achieved from VizAPI
    return ErrorMessages.errorOnTheServer();
>>>>>>> master
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
    const lbbUsers = ApiService
      .fetchUsersForChannel(context.channelId)
      .then((users) => users.map((user) => user.data));

    // If 1 User was sent
    if (username !== '') {
      // Get User from args
      const user = await ApiService
        .findUserInChannel(context.channelId, username);

      // If User does not exist, return error message
<<<<<<< HEAD
      if (!user) return UserMessages.doesNotExist(username);
=======
      if (!user) return UserMessages.userDoesNotExistInThisChannel(username);
>>>>>>> master

      // Get language stats from LeetCode
      const data = user.data.languageStats ?? [];

      return BigMessages.languageStatsText(username, data);
    }

    const { users } = context.channelCache;

    if (users.length === 0) {
      return ErrorMessages.noUsersFoundInDatabase;
    }

    // If no username was sent, show buttons for each username in channel
    // to pick from
    context.options.buttons = [{
      buttons: createButtonsFromUsers({
        action: 'langstats',
<<<<<<< HEAD
        users: await lbbUsers,
=======
        users,
>>>>>>> master
      }),
      buttonPerRow: 3,
      placeholder: 'Username',
      type: ButtonContainerType.MultipleButtons,
    }, getCloseButton()];

    // If 0 User was sent
<<<<<<< HEAD
    return ListMessages.userListLangstats;
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

    if (subscriptionTypeKey === '') {
      // If Subscription Type was not sent, return buttons
      context.options.buttons = [{
        buttons: subscriptionTypeManager.getAll()
          .map((subscriptionTypeModel: FullSubscriptionTypeModel) => ({
            text: subscriptionTypeModel.humanName,
            action: `/subscribe ${subscriptionTypeModel.key}`,
          })),
        buttonPerRow: 3,
        placeholder: 'Subscription Type',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return ListMessages.userListSubscription;
    }

    const subscriptionTypeModel = subscriptionTypeManager
      .getByKey(subscriptionTypeKey);

    if (!subscriptionTypeModel) {
      return 'Invalid subscription type';
    }

    const { subscriptionType, humanName } = subscriptionTypeModel;

    // Subscribe
    const result = await ApiService
      .createSubscription({
        channel: context.channelId,
        type: subscriptionType,
      })
      .catch((err) => {
        log(err);
        return null;
      });

    return result
      ? SubscriptionMessages.subscriptionSuccess(humanName)
      : SubscriptionMessages.subscriptionError(humanName);
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

    if (subscriptionTypeKey === '') {
      // If Subscription Type was not sent, return buttons
      context.options.buttons = [{
        buttons: subscriptionTypeManager.getAll()
          .map((subscriptionTypeModel: FullSubscriptionTypeModel) => ({
            text: subscriptionTypeModel.humanName,
            action: `/unsubscribe ${subscriptionTypeModel.key}`,
          })),
        buttonPerRow: 3,
        placeholder: 'Subscription Type',
        type: ButtonContainerType.MultipleButtons,
      }, getCloseButton()];

      return ListMessages.userListUnsubscription;
    }

    const subscriptionTypeModel = subscriptionTypeManager
      .getByKey(subscriptionTypeKey);

    if (!subscriptionTypeModel) {
      return 'Invalid subscription type';
    }

    const { subscriptionType, humanName } = subscriptionTypeModel;

    // Unsubscribe
    const result = await ApiService
      .deleteSubscriptionByType(subscriptionType, context.channelId);

    return result
      ? SubscriptionMessages.unsubscriptionSuccess(humanName)
      : SubscriptionMessages.unsubscriptionError(humanName);
  }

  @action({ name: 'subscriptions', isAdmin: true })
  static async subscriptions(context: Context): Promise<string> {
    const channel = await ApiService.getChannel(context.channelId);
    return BigMessages.subscriptionsText(channel.subscriptions);
=======
    return UserMessages.userListLangstats;
>>>>>>> master
  }
}
