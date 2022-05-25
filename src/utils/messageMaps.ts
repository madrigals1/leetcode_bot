import { LBBSubscription, LBBUsernameResponse } from '../backend/models';
import { ChatbotProvider, getChatbotNameByKey } from '../chatbots/models';
import {
  subscriptionTypeManager,
  FullSubscriptionTypeModel,
} from '../chatbots/subscriptionTypeManager';
import { LanguageProblemCount, User } from '../leetcode/models';

import { constants } from './constants';

const {
  EMOJI, CML, PROVIDERS, SYSTEM,
} = constants;

class ErrorMessages {
  static server = `${EMOJI.ERROR} Error on the server side`;
}

class UserAddMessages {
  static success(username: string): string {
    const message = `${EMOJI.SUCCESS} User is successfully added`;
    return `<b>${username}</b> - ${message}`;
  }

  static alreadyExists(username: string): string {
    const message = `${EMOJI.ERROR} User already exists in this channel`;
    return `<b>${username}</b> - ${message}`;
  }

  static leetcodeNotFoundUsername(username: string): string {
    const message = `${EMOJI.ERROR} User not found in Leetcode`;
    return `<b>${username}</b> - ${message}`;
  }

  static leetcodeUnknownError(username: string): string {
    const message = `${EMOJI.ERROR} Unknown error on Leetcode side`;
    return `<b>${username}</b> - ${message}`;
  }

  static unknownError(username: string): string {
    const message = `${EMOJI.ERROR} Error on the server side`;
    return `<b>${username}</b> - ${message}`;
  }

  static userList(responses: LBBUsernameResponse[]): string {
    if (!responses) {
      return ErrorMessages.server;
    }

    const message = responses
      .map((res) => this[res.detail](res.username))
      .join('\n');

    return `User List:\n${message}`;
  }
}

class UserMessages {
  static doesNotExist(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not exist in this channel';
    return `${emoji} ${user} ${message}`;
  }

  static avatar = `${EMOJI.CAMERA} Avatar`;

  static usernamesAvatar(username: string): string {
    return `${username}'s avatar`;
  }

  static recentSubmissions(username: string): string {
    return `${username}'s recent submissions`;
  }

  static solvedProblemsChart(username: string): string {
    return `${username}'s solved problems chart`;
  }

  static selectLeftUser = `${EMOJI.PERSON} Select Left User`;

  static selectRightUser = `${EMOJI.PERSON} Select Right User`;

  static compare(leftUsername: string, rightUsername: string): string {
    return `Comparing ${leftUsername} to ${rightUsername}`;
  }

  static noAdminRights = `${EMOJI.ERROR} You need administrator priveleges to `
    + 'execute this action';

  static noSubmissions(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not have any submissions';

    return `${emoji} ${user} ${message}`;
  }
}

class UserDeleteMessages {
  static success(username: string): string {
    const emoji = EMOJI.SUCCESS;
    const user = `User <b>${username}</b>`;
    const message = 'was successfully deleted';
    return `${emoji} ${user} ${message}`;
  }

  static willBeDeleted(username: string): string {
    const emoji = EMOJI.WAITING;
    const user = `User <b>${username}</b>`;
    const message = 'will be deleted';
    return `${emoji} ${user} ${message}`;
  }
}

class SmallMessages {
  static pong = 'pong';

  static helpText = (
    'Contact @madrigals1 in Telegram or madrigals1#9652 in Discord'
  );

  static noUsers = `${EMOJI.ERROR} No users found in database`;

  static noSubmissionsKey = 'no_submissions';

  static apiNotWorkingKey = 'api_not_working';

  static incorrectBotType = 'Incorrect bot type';
}

class BigMessages {
  static welcomeText(prefix: string): string {
    return `Welcome! This is Leetcode Rating Bot Elite ${EMOJI.COOL} Boys

<b>Main commands:</b>
<b><i>${prefix}start</i></b> - Starting Page
<b><i>${prefix}help</i></b> - FAQ
<b><i>${prefix}rating</i></b> - Overall rating of Users
<b><i>${prefix}refresh</i></b> - Manual refresh of User Cache
<b><i>${prefix}profile</i></b> - Profiles of Users
<b><i>${prefix}submissions</i></b> - Submissions for Users
<b><i>${prefix}avatar</i></b> - Avatars for Users
<b><i>${prefix}problems</i></b> - Chart with Solved Problems for Users
<b><i>${prefix}langstats</i></b> - Amount of Solved Problems in each language for Users

<b>User related commands:</b>
<b><i>${prefix}add username1 username2</i></b> ... - adding Users
<b><i>${prefix}profile username</i></b> - Profile for separate User
<b><i>${prefix}avatar username</i></b> - Avatar for User
<b><i>${prefix}submissions username</i></b> - Get all recent submissions for User as Table
<b><i>${prefix}compare username1 username2</i></b> - Compare 2 Users' stats
<b><i>${prefix}problems username</i></b> - Chart with Solved Problems for specific User
<b><i>${prefix}langstats username</i></b> - Amount of Solved Problems in each language given User

<b>Admin commands (Only admin or local chat):</b>
<b><i>${prefix}remove username</i></b> - Remove User
<b><i>${prefix}clear</i></b> - Clear Database from all Users
<b><i>${prefix}stats</i></b> - Show Stats for this Bot
`;
  }

  static statsText(provider: ChatbotProvider, users: User[]): string {
    const userNameList = users.map(
      (user) => (`<b>- ${user.username}</b>`),
    ).join('\n');

    const providerName = getChatbotNameByKey(provider);
    const providerKey = Object.keys(PROVIDERS)
      .find((key) => PROVIDERS[key].NAME === providerName);

    return `
<b>PROVIDER RELATED</b>
<b>Provider:</b> ${PROVIDERS[providerKey].NAME}
<b>Prefix:</b> ${PROVIDERS[providerKey].PREFIX}
<b>Discord enabled:</b> ${PROVIDERS.DISCORD.ENABLE}
<b>Telegram enabled:</b> ${PROVIDERS.TELEGRAM.ENABLE}
<b>Slack enabled:</b> ${PROVIDERS.SLACK.ENABLE}

<b>DATABASE RELATED</b>
<b>User Count:</b> ${users.length}

<b>SYSTEM RELATED</b>
<b>Delay between calls:</b> ${SYSTEM.USER_REQUEST_DELAY_MS}

<b>USER LIST</b>
${userNameList}
    `;
  }

  static cmlHeader = `Cumulative Rating:
${EMOJI.GREEN_CIRCLE} Easy - <b>${CML.EASY_POINTS} points</b>
${EMOJI.YELLOW_CIRCLE} Medium - <b>${CML.MEDIUM_POINTS} points</b>
${EMOJI.RED_CIRCLE} Hard - <b>${CML.HARD_POINTS} points</b>
  
`;

  static ratingText(users: User[]): string {
    if (!users || users.length === 0) {
      return SmallMessages.noUsers;
    }
    return users.map(
      (user, index) => (`${index + 1}. <b>${user.username}</b> ${user.solved}`),
    ).join('\n');
  }

  static cmlRatingText(users: User[]): string {
    if (!users || users.length === 0) {
      return SmallMessages.noUsers;
    }

    const rating = this.cmlHeader;
    const cmlText = users.map(
      (user, index) => {
        const cmlForUser = user.computed.problemsSolved.cumulative;
        const cmlTextForUser = `<b>${user.username}</b> ${cmlForUser}`;
        return `${index + 1}. ${cmlTextForUser}`;
      },
    ).join('\n');

    return rating + cmlText;
  }

  static userText(user: User): string {
    const {
      easy, medium, hard, all, cumulative,
    } = user.computed.problemsSolved;

    return `<b>${user.name || 'No name'}</b> - <b>${user.link}</b>

Solved Problems:
${EMOJI.GREEN_CIRCLE} Easy - <b>${easy}</b>
${EMOJI.YELLOW_CIRCLE} Medium - <b>${medium}</b>
${EMOJI.RED_CIRCLE} Hard - <b>${hard}</b>
${EMOJI.BLUE_CIRCLE} All - <b>${all} / ${user.all}</b>
${EMOJI.BLUE_DIAMOND} Cumulative - <b>${cumulative}</b>`;
  }

  static languageStatsText(
    username: string, lpc: LanguageProblemCount[],
  ): string {
    // Sort by amount of solved problems
    const lpcSorted = lpc
      .sort((value1, value2) => value2.problemsSolved - value1.problemsSolved);

    const lpcText = lpcSorted
      .map(({ languageName, problemsSolved }) => {
        const name = `- <b>${languageName}</b>`;
        return `${name} ${problemsSolved}`;
      })
      .join('\n');
    const emoji = EMOJI.PROGRAMMER;
    const prefix = `${emoji} Problems solved by <b>${username}</b> in:\n`;

    return prefix + lpcText;
  }

  static subscriptionsText(subscriptions: LBBSubscription[]): string {
    const allSubscriptionTypes = subscriptionTypeManager.getAll();
    const subscriptionTypesForSubscriptions = subscriptions
      .map((subscription: LBBSubscription) => subscription.type);

    return allSubscriptionTypes
      .map((fsub: FullSubscriptionTypeModel) => {
        const contains = (
          subscriptionTypesForSubscriptions.includes(fsub.subscriptionType)
        );

        return contains
          ? `${fsub.humanName} - ${EMOJI.SUCCESS}`
          : `${fsub.humanName} - ${EMOJI.CROSS_MARK}`;
      }).join('\n');
  }
}
class RefreshMessages {
  static cacheStartedRefresh = `${EMOJI.WAITING} Cache refresh was `
    + 'requested...';

  static cacheIsRefreshed = `${EMOJI.SUCCESS} Cache is refreshed`;
}

class ClearMessages {
  static channelWillBeCleared = `${EMOJI.WASTEBASKET} Channel will be cleared`;

  static channelWasCleared = `${EMOJI.SUCCESS} Channel was cleared`;

  static channelWasNotCleared = `${EMOJI.ERROR} Channel was not cleared`;
}

class RatingMessages {
  static cmlRating = `${EMOJI.ABACUS} Cumulative Rating`;

  static regularRating = `${EMOJI.CLIPBOARD} Regular Rating`;

  static graphRating = `${EMOJI.CHART} Graph Rating`;

  static incorrectRatingType = `${EMOJI.ERROR} Incorrect rating type`;
}

class ListMessages {
  static userListProfiles = `${EMOJI.PERSON} Profiles`;

  static userListSubmissions = `${EMOJI.CLIPBOARD} Submissions`;

  static userListProblems = `${EMOJI.CHART} Problems`;

  static userListAvatars = `${EMOJI.CAMERA} Avatars`;

  static userListLangstats = `${EMOJI.PROGRAMMER} Language stats`;

  static userListRemove = `${EMOJI.WASTEBASKET} Remove User`;

  static backToProfiles = `${EMOJI.BACK_ARROW} Back to Profiles`;

  static userListSubscription = `${EMOJI.BELL} Subscribe`;

  static userListUnsubscription = `${EMOJI.BELL} Unsubscribe`;
}

class SubscriptionMessages {
  static subscriptionSuccess(name: string): string {
    return `${EMOJI.SUCCESS} Subscribed to ${name}`;
  }

  static subscriptionError(name: string): string {
    return `${EMOJI.ERROR} Not subscribed to ${name}`;
  }

  static unsubscriptionSuccess(name: string): string {
    return `${EMOJI.SUCCESS} Unsubscribed from ${name}`;
  }

  static unsubscriptionError(name: string): string {
    return `${EMOJI.ERROR} Not unsubscribed from ${name}`;
  }
}

class ProviderMessages {
  static discordBotIsConnected = '>>> Discord BOT is connected!';

  static discordBotIsRunning = '>>> Discord BOT is running!';

  static telegramBotIsConnected = '>>> Telegram BOT is connected!';

  static telegramBotIsRunning = '>>> Telegram BOT is running!';

  static slackBotIsConnected = '>>> Slack BOT is connected!';

  static slackBotIsRunning = '>>> Slack BOT is running!';
}

class ImageMessages {
  static imageWasCreated = 'The image was created';

  static imageWasNotCreated(err: Error | string): string {
    return `The image was NOT created: ${err}`;
  }
}

class ArgumentMessages {
  static insufficientArgsInMessage =
    `${EMOJI.ERROR} Insufficient arguments in message`;

  static shouldNotRequestMoreThan100Args =
    `${EMOJI.ERROR} Should not request more than 100 arguments`;

  static shouldNotProvideMoreThan100Args =
    `${EMOJI.ERROR} Should not provide more than 100 arguments`;

  static requiredArgXWasNotProvided(name: string): string {
    return `${EMOJI.ERROR} Required argument ${name} was not provided`;
  }

  static invalidArgTypeProvidedFromDiscord(value: unknown): string {
    return `Invalid argument type provided from Discord: ${typeof value}`;
  }

  static duplicateKeysInArgs(keys: string[]): string {
    return `${EMOJI.ERROR} Duplicate keys ${keys} are found in arguments`;
  }

  static duplicateIndexesInArgs(keys: number[]): string {
    return `${EMOJI.ERROR} Duplicate indexes ${keys} are found in arguments`;
  }

  static shouldNotHaveRequiredArgsAfterOptional =
    `${EMOJI.ERROR} Should not have required arguments after optional `
      + 'arguments';

  static messageShouldHaveNoArgs =
    `${EMOJI.ERROR} Message should not have any arguments`;

  static indexShouldBePresentInArgs(i: number): string {
    return `${EMOJI.ERROR} Index ${i} should be present in arguments`;
  }

  static argIsNotProvided(i: number): string {
    return `${EMOJI.ERROR} Argument ${i} is not provided`;
  }
}

export {
  UserAddMessages,
  UserDeleteMessages,
  BigMessages,
  SmallMessages,
  RefreshMessages,
  ClearMessages,
  RatingMessages,
  ErrorMessages,
  ListMessages,
  UserMessages,
  SubscriptionMessages,
  ProviderMessages,
  ImageMessages,
  ArgumentMessages,
};
