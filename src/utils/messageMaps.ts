import { LBBUsernameResponse } from '../backend/models';
import { ChatbotProvider, getChatbotNameByKey } from '../chatbots/models';
import { User } from '../leetcode/models';

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

class UserDeleteMessages {
  static success(username: string): string {
    const emoji = EMOJI.SUCCESS;
    const user = `User <b>${username}</b>`;
    const message = 'was successfully deleted';
    return `${emoji} ${user} ${message}`;
  }

  static doesNotExist(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not exist in this channel';
    return `${emoji} ${user} ${message}`;
  }

  static willBeDeleted(username: string): string {
    const emoji = EMOJI.WAITING;
    const user = `User <b>${username}</b>`;
    const message = 'will be deleted';
    return `${emoji} ${user} ${message}`;
  }

  static userListRemove = `${EMOJI.WASTEBASKET} Remove User`;
}

class SmallMessages {
  static pong = 'pong';

  static helpText = (
    'Contact @madrigals1 in Telegram or madrigals1#9652 in Discord'
  );

  static noUsers = `${EMOJI.ERROR} No users found in database`;
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

export {
  UserAddMessages,
  UserDeleteMessages,
  BigMessages,
  SmallMessages,
  RefreshMessages,
  ClearMessages,
  RatingMessages,
  ErrorMessages,
};
