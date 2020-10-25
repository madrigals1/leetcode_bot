const { LEETCODE_URL, EMOJI } = require('./constants');

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
};

const NO_USERS = `${EMOJI.ERROR} No users found in database`;

const BOT_MESSAGES = {
  // MISC
  INCORRECT_INPUT: `${EMOJI.ERROR} Incorrect input`,
  PASSWORD_IS_INCORRECT: `${EMOJI.ERROR} Password is incorrect`,

  // REFRESHING
  STARTED_REFRESH: `${EMOJI.WAITING} Database started refresh`,
  IS_REFRESHED: `${EMOJI.SUCCESS} Database is refreshed`,
  IS_ALREADY_REFRESHING: `${EMOJI.ERROR} Database is already refreshing`,

  // USER RELATED
  USER_LIST: (userList) => `User List:\n${userList}`,
  AT_LEAST_1_USERNAME: (prefix) => (
    `${EMOJI.WARNING} Please, enter at least 1 username after <b>${prefix}add</b> command`
  ),
  NO_USERS,
  USERNAME_NOT_FOUND: (username) => `${EMOJI.ERROR} Username <b>${username}</b> was not found in database`,
  USERNAME_NOT_FOUND_ON_LEETCODE: (username) => (
    `${EMOJI.ERROR} User <b>${username}</b> was not found on <b>LeetCode</b>\n`
  ),
  USERNAME_ALREADY_EXISTS: (username) => (
    `${EMOJI.ERROR} User <b>${username}</b> already exists in database\n`
  ),
  USERNAME_WAS_ADDED: (username) => `${EMOJI.SUCCESS} <b>${username}</b> was added\n`,
  USERNAME_WILL_BE_DELETED: (username) => `${EMOJI.WAITING} User <b>${username}</b> will be deleted`,
  USERNAME_WAS_DELETED: (username) => `${EMOJI.SUCCESS} User <b>${username}</b> was deleted`,

  // DATABASE
  DATABASE_WILL_BE_CLEARED: `${EMOJI.WASTEBASKET} Database will be cleared`,
  DATABASE_WAS_CLEARED: `${EMOJI.SUCCESS} Database was cleared`,
  DATABASE_WAS_NOT_CLEARED: `${EMOJI.ERROR} Database was not cleared`,

  // BIG TEXTS
  WELCOME_TEXT: (prefix) => `Welcome! This is Leetcode Rating bot Elite ${EMOJI.COOL} Boys
<b><i>${prefix}rating</i></b> - Overall rating
<b><i>${prefix}rating username</i></b> - Rating for separate User
<b><i>${prefix}avatar username</i></b> - Avatar for User
<b><i>${prefix}refresh</i></b> - Manual refresh of database.
<b><i>${prefix}add username1 username2</i></b> ... - adding Isers`,
  USER_TEXT: (user) => `<b>Name:</b> ${user.name || 'No name'}
<b>Username:</b> ${user.username}
<b>Link:</b> <b>${user.link}</b>
<b>Solved:</b> ${user.solved} / ${user.all}

<b>Last ${user.submissions.length} Submissions:</b>
${user.submissions.map((submission) => `
<b>${submission.name}</b>
<b>Link:</b> <b>${LEETCODE_URL}${submission.link}</b>
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
};

module.exports = {
  BOT_MESSAGES,
  SERVER_MESSAGES,
};
