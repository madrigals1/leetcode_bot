import { User } from '../leetcode/models';
import Cache from '../cache';

import constants from './constants';

const SERVER_MESSAGES = {
  // ERROR
  ERROR_ON_THE_SERVER(error: Error | string): string {
    return `Error on the server: ${error}`;
  },

  // REFRESHING
  DATABASE_STARTED_REFRESH(time: string): string {
    return `Database started refresh at ${time}`;
  },
  DATABASE_FINISHED_REFRESH(time: string): string {
    return `Database is refreshed at ${time}`;
  },
  IS_ALREADY_REFRESHING: 'Database is already refreshing',
  USERNAME_WAS_REFRESHED(username: string): string {
    return `${username} was refreshed`;
  },
  USERNAME_WAS_NOT_REFRESHED(username: string): string {
    return `${username} was not refreshed`;
  },

  // CONNECTION TO DB
  CONNECTION_STATUS: {
    SUCCESSFUL: 'Database connection successful!',
    ERROR(error: Error | string): string {
      return `Database connection error: ${error}`;
    },
  },

  // BOT LOGS
  DISCORD_BOT_IS_CONNECTED: '>>> Discord BOT is connected!',
  DISCORD_BOT_IS_RUNNING: '>>> Discord BOT is running!',
  TELEGRAM_BOT_IS_CONNECTED: '>>> Telegram BOT is connected!',
  TELEGRAM_BOT_IS_RUNNING: '>>> Telegram BOT is running!',
  SLACK_BOT_IS_CONNECTED: '>>> Slack BOT is connected!',
  SLACK_BOT_IS_RUNNING: '>>> Slack BOT is running!',

  // LOGGING
  IMAGE_WAS_CREATED: 'The image was created',
  IMAGE_WAS_NOT_CREATED: 'The image was NOT created',

  // TABLE API
  API_NOT_WORKING: 'api_not_working',
  NO_SUBMISSIONS: 'no_submissions',
};

const NO_USERS = `${constants.EMOJI.ERROR} No users found in database`;

const BOT_MESSAGES = {
  // MISC
  INCORRECT_INPUT: `${constants.EMOJI.ERROR} Incorrect input`,
  PASSWORD_IS_INCORRECT: `${constants.EMOJI.ERROR} Password is incorrect`,
  ERROR_ON_THE_SERVER: `${constants.EMOJI.ERROR} Error on the server`,

  // REFRESHING
  STARTED_REFRESH: `${constants.EMOJI.WAITING} Database started refresh`,
  IS_REFRESHED: `${constants.EMOJI.SUCCESS} Database is refreshed`,
  IS_ALREADY_REFRESHING: `${constants.EMOJI.ERROR} Database is already refreshing`,

  // USER RELATED
  USER_LIST(userList: string): string {
    return `User List:\n${userList}`;
  },
  NO_USERS,
  USER_NO_SUBMISSIONS(username: string): string {
    return `${constants.EMOJI.ERROR} User <b>${username}</b> does not have any submissions`;
  },

  // USERNAME RELATED
  AT_LEAST_1_USERNAME(prefix: string): string {
    return `${constants.EMOJI.WARNING} Please, enter at least 1 username after <b>${prefix}add</b> command`;
  },
  USERNAME_NOT_FOUND(username: string): string {
    return `${constants.EMOJI.ERROR} Username <b>${username}</b> was not found in database`;
  },
  USERNAME_NOT_FOUND_ON_LEETCODE(username: string): string {
    return `${constants.EMOJI.ERROR} User <b>${username}</b> was not found on <b>LeetCode</b>\n`;
  },
  USERNAME_ALREADY_EXISTS(username: string): string {
    return `${constants.EMOJI.ERROR} User <b>${username}</b> already exists in database\n`;
  },
  USERNAME_WAS_ADDED(
    username: string, userAmount: number, userLimit: number,
  ): string {
    return `${constants.EMOJI.SUCCESS} <b>${username}</b> was added <b>${userAmount}/${userLimit}</b>\n`;
  },
  USERNAME_WILL_BE_DELETED(username: string): string {
    return `${constants.EMOJI.WAITING} User <b>${username}</b> will be deleted`;
  },
  USERNAME_WAS_DELETED(username: string): string {
    return `${constants.EMOJI.SUCCESS} User <b>${username}</b> was deleted`;
  },
  USERNAME_NOT_ADDED_USER_LIMIT(username: string, userLimit: number): string {
    return `${constants.EMOJI.ERROR} <b>${username}</b> was not added because of User Limit: <b>${userLimit}</b>\n`;
  },
  USER_LIST_SUBMISSIONS: `${constants.EMOJI.CARD_FILE_BOX} Submissions Menu`,
  USER_LIST_AVATARS: `${constants.EMOJI.PEOPLE} Avatars Menu`,
  USER_LIST_REMOVE: `${constants.EMOJI.WASTEBASKET} Remove Menu`,
  USER_LIST_USERS: 'User list',

  // DATABASE
  DATABASE_WILL_BE_CLEARED: `${constants.EMOJI.WASTEBASKET} Database will be cleared`,
  DATABASE_WAS_CLEARED: `${constants.EMOJI.SUCCESS} Database was cleared`,
  DATABASE_WAS_NOT_CLEARED: `${constants.EMOJI.ERROR} Database was not cleared`,

  // BIG TEXTS
  WELCOME_TEXT(prefix: string): string {
    return `Welcome! This is Leetcode Rating Bot Elite ${constants.EMOJI.COOL} Boys

<b>Main commands:</b>
<b><i>${prefix}start</i></b> - Starting Page
<b><i>${prefix}rating</i></b> - Overall rating of Users
<b><i>${prefix}refresh</i></b> - Manual refresh of Database 
<b><i>${prefix}submissions</i></b> - Submissions for Users
<b><i>${prefix}avatar</i></b> - Avatars for Users

<b>User related commands:</b>
<b><i>${prefix}add username1 username2</i></b> ... - adding Users
<b><i>${prefix}profile username</i></b> - Profile for separate User
<b><i>${prefix}avatar username</i></b> - Avatar for User
<b><i>${prefix}submissions username</i></b> - Get all recent submissions for User as Table
<b><i>${prefix}compare username1 username2</i></b> - Compare 2 Users' stats

<b>Admin commands:</b>
<b><i>${prefix}remove username master_password</i></b> - Remove User
<b><i>${prefix}clear master_password</i></b> - Clear Database from all Users
<b><i>${prefix}stats master_password</i></b> - Show Stats for this Bot
`;
  },
  USER_TEXT(user: User): string {
    const { acSubmissionNum } = user.submitStats;

    // Get submissions for different difficulty levels
    const easy = acSubmissionNum.find((sc) => (sc.difficulty === 'Easy'));
    const medium = acSubmissionNum.find((sc) => (sc.difficulty === 'Medium'));
    const hard = acSubmissionNum.find((sc) => (sc.difficulty === 'Hard'));
    const all = acSubmissionNum.find((sc) => (sc.difficulty === 'All'));

    return `<b>${user.name || 'No name'}</b> - <b>${user.link}</b>

Solved Problems:
${constants.EMOJI.GREEN_SQUARE} Easy - <b>${easy.count}</b>
${constants.EMOJI.YELLOW_SQUARE} Medium - <b>${medium.count}</b>
${constants.EMOJI.RED_SQUARE} Hard - <b>${hard.count}</b>
${constants.EMOJI.BLUE_SQUARE} All - <b>${all.count} / ${user.all}</b>`;
  },
  RATING_TEXT(users: User[]): string {
    if (!users || users.length === 0) {
      return NO_USERS;
    }
    return users.map(
      (user, index) => (`${index + 1}. <b>${user.username}</b> ${user.solved}`),
    ).join('\n');
  },

  STATS_TEXT(providerName: string, cache: typeof Cache): string {
    const { userLimit, users } = cache;

    // Get prefix for provider
    const prefix = constants.PROVIDERS
      .find((provider) => (provider.NAME === providerName))
      .PREFIX;

    const userNameList = users.map(
      (user) => (`<b>- ${user.username}</b>`),
    ).join('\n');

    return `
<b>PROVIDER RELATED</b>
<b>Provider:</b> ${providerName}
<b>Prefix:</b> ${prefix}
<b>Discord enabled:</b> ${constants.DISCORD.ENABLE}
<b>Telegram enabled:</b> ${constants.TELEGRAM.ENABLE}

<b>DATABASE RELATED</b>
<b>Database:</b> ${constants.DB_PROVIDER}
<b>User Count:</b> ${users.length}
<b>User amount limit:</b> ${userLimit}

<b>SYSTEM RELATED</b>
<b>Submissions:</b> ${constants.SUBMISSION_COUNT}
<b>Delay between calls:</b> ${constants.DELAY_TIME_MS}

<b>USER LIST</b>
${userNameList}
    `;
  },
};

export default {
  BOT_MESSAGES,
  SERVER_MESSAGES,
};
