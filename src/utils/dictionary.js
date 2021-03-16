import constants from './constants';

const SERVER_MESSAGES = {
  // ERROR
  ERROR_ON_THE_SERVER: (error) => `Error on the server: ${error}`,

  // REFRESHING
  DATABASE_STARTED_REFRESH: (time) => `Database started refresh at ${time}`,
  DATABASE_FINISHED_REFRESH: (time) => `Database is refreshed at ${time}`,
  IS_ALREADY_REFRESHING: 'Database is already refreshing',
  USERNAME_WAS_REFRESHED: (username) => `${username} was refreshed`,
  USERNAME_WAS_NOT_REFRESHED: (username) => `${username} was not refreshed`,

  // CONNECTION TO DB
  CONNECTION_STATUS: {
    SUCCESSFUL: 'Database connection successful!',
    ERROR: (error) => `Database connection error: ${error}`,
  },

  DISCORD_BOT_IS_CONNECTED: '>>> Discord BOT is connected!',
  DISCORD_BOT_IS_RUNNING: '>>> Discord BOT is running!',
  TELEGRAM_BOT_IS_CONNECTED: '>>> Telegram BOT is connected!',
  TELEGRAM_BOT_IS_RUNNING: '>>> Telegram BOT is running!',

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
  USER_LIST: (userList) => `User List:\n${userList}`,
  AT_LEAST_1_USERNAME: (prefix) => (
    `${constants.EMOJI.WARNING} Please, enter at least 1 username after <b>${prefix}add</b> command`
  ),
  NO_USERS,
  USERNAME_NOT_FOUND: (username) => `${constants.EMOJI.ERROR} Username <b>${username}</b> was not found in database`,
  USERNAME_NOT_FOUND_ON_LEETCODE: (username) => (
    `${constants.EMOJI.ERROR} User <b>${username}</b> was not found on <b>LeetCode</b>\n`
  ),
  USERNAME_ALREADY_EXISTS: (username) => (
    `${constants.EMOJI.ERROR} User <b>${username}</b> already exists in database\n`
  ),
  USERNAME_WAS_ADDED: (username, userAmount, userLimit) => `${constants.EMOJI.SUCCESS} <b>${username}</b> was added <b>${userAmount}/${userLimit}</b>\n`,
  USERNAME_WILL_BE_DELETED: (username) => `${constants.EMOJI.WAITING} User <b>${username}</b> will be deleted`,
  USERNAME_WAS_DELETED: (username) => `${constants.EMOJI.SUCCESS} User <b>${username}</b> was deleted`,
  USER_NO_SUBMISSIONS: (user) => (
    `${constants.EMOJI.ERROR} User <b>${user}</b> does not have any submissions`
  ),
  USERNAME_NOT_ADDED_USER_LIMIT: (username, userLimit) => `${constants.EMOJI.ERROR} <b>${username}</b> was not added because of User Limit: <b>${userLimit}</b>\n`,
  USER_LIST_SUBMISSIONS: `${constants.EMOJI.CARD_FILE_BOX} Submissions`,
  USER_LIST_AVATARS: `${constants.EMOJI.CARD_FILE_BOX} Avatars`,

  // DATABASE
  DATABASE_WILL_BE_CLEARED: `${constants.EMOJI.WASTEBASKET} Database will be cleared`,
  DATABASE_WAS_CLEARED: `${constants.EMOJI.SUCCESS} Database was cleared`,
  DATABASE_WAS_NOT_CLEARED: `${constants.EMOJI.ERROR} Database was not cleared`,

  // BIG TEXTS
  WELCOME_TEXT: (prefix) => `Welcome! This is Leetcode Rating bot Elite ${constants.EMOJI.COOL} Boys

<b>Main commands:</b>
<b><i>${prefix}start</i></b> - Starting Page
<b><i>${prefix}rating</i></b> - Overall rating
<b><i>${prefix}refresh</i></b> - Manual refresh of database 
<b><i>${prefix}add username1 username2</i></b> ... - adding Users
<b><i>${prefix}submissions</i></b> - Submissions list
<b><i>${prefix}avatar</i></b> - Avatar list

<b>User related commands:</b> 
<b><i>${prefix}rating username</i></b> - Rating for separate User
<b><i>${prefix}avatar username</i></b> - Avatar for User
<b><i>${prefix}submissions username</i></b> - Get all recent submissions for User as Table

<b>Admin commands:</b>
<b><i>${prefix}remove username master_password</i></b> - Remove User
<b><i>${prefix}clear master_password</i></b> - Clear Database
<b><i>${prefix}stats master_password</i></b> - Show Stats for this BOT
`,
  USER_TEXT: (user) => `<b>Name:</b> ${user.name || 'No name'}
<b>Username:</b> ${user.username}
<b>Link:</b> <b>${user.link}</b>
<b>Solved:</b> ${user.solved} / ${user.all}

<b>Last ${user.submissions.length} Submissions:</b>
${user.submissions.slice(0, constants.SUBMISSION_COUNT).map((submission) => `
<b>${submission.name}</b>
<b>Link:</b> <b>${constants.LEETCODE_URL}${submission.link}</b>
<b>Status:</b> ${submission.status}
<b>Language:</b> ${submission.language}
<b>Time:</b> ${submission.time}
`).join('\n')}`,
  RATING_TEXT: (users) => {
    if (!users || users.length === 0) {
      return NO_USERS;
    }
    return users.map(
      (user, index) => (`${index + 1}. <b>${user.username}</b> ${user.solved}`),
    ).join('\n');
  },

  STATS_TEXT: (providerName, cache) => {
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
