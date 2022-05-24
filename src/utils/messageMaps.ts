import { LBBUsernameResponse } from '../backend/models';
import { ChatbotProvider, getChatbotNameByKey } from '../chatbots/models';
import { User } from '../leetcode/models';

import { constants } from './constants';

const { EMOJI } = constants;

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

  static unknownErrorOverall = `${EMOJI.ERROR} Error on the server side`;

  static userList(responses: LBBUsernameResponse[]): string {
    if (!responses) {
      return this.unknownErrorOverall;
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
}

class BigMessages {
  static welcomeText(prefix: string): string {
    return `Welcome! This is Leetcode Rating Bot Elite ${constants.EMOJI.COOL} Boys

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
    const providerKey = Object.keys(constants.PROVIDERS)
      .find((key) => constants.PROVIDERS[key].NAME === providerName);

    return `
<b>PROVIDER RELATED</b>
<b>Provider:</b> ${constants.PROVIDERS[providerKey].NAME}
<b>Prefix:</b> ${constants.PROVIDERS[providerKey].PREFIX}
<b>Discord enabled:</b> ${constants.PROVIDERS.DISCORD.ENABLE}
<b>Telegram enabled:</b> ${constants.PROVIDERS.TELEGRAM.ENABLE}
<b>Slack enabled:</b> ${constants.PROVIDERS.SLACK.ENABLE}

<b>DATABASE RELATED</b>
<b>User Count:</b> ${users.length}

<b>SYSTEM RELATED</b>
<b>Delay between calls:</b> ${constants.SYSTEM.USER_REQUEST_DELAY_MS}

<b>USER LIST</b>
${userNameList}
    `;
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

export {
  UserAddMessages,
  UserDeleteMessages,
  BigMessages,
  SmallMessages,
  RefreshMessages,
  ClearMessages,
};
