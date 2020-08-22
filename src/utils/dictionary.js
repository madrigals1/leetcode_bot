const { LEETCODE_URL, EMOJI } = require('./constants');

const SERVER_MESSAGES = {
  // ERROR
  ERROR_ON_THE_SERVER: (error) => `Error on the server: ${error}`,

  // USER
  // USERNAME_WAS_ADDED: (username) => `${username} was added to Database`,
  // USERNAME_WAS_NOT_ADDED: (username) => `${username} was not added to Database`,
  // USERNAME_ALREADY_EXISTS: (username) => `${username} already exists in Database`,

  // REFRESHING
  REFRESH_IN_PROCESS: 'Refreshing',
  REFRESH_SUCCESS: 'Successfully refreshed',
  REFRESH_FAILURE: 'Failed refreshing',
  REFRESH_FINISHED: 'Finished refresh',
  DATABASE_STARTED_REFRESH: (time) => `Database started refresh at ${time}`,
  IS_REFRESHED: (time) => `Database is refreshed at ${time}`,
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
  IS_ALREADY_REFRESHING: `${EMOJI.WAITING} Database is already refreshing`,

  // USER RELATED
  USER_LIST: (userList) => `User List:\n${userList}`,
  AT_LEAST_1_USERNAME: (prefix) => (
    `${EMOJI.WARNING} Please, enter at least 1 username after *${prefix}add* command`
  ),
  NO_USERS,
  USERNAME_NOT_FOUND: (username) => `${EMOJI.ERROR} Username *${username}* was not found in database`,
  USERS_ARE_REFRESHED: `${EMOJI.SUCCESS} Users are refreshed`,
  USERNAME_NOT_FOUND_ON_LEETCODE: (username) => `${EMOJI.ERROR} User *${username}* is not found on *LeetCode*`,
  USERNAME_ALREADY_EXISTS: (username) => `${EMOJI.ERROR} User *${username}* already exists in database\n`,
  // USERNAME_WILL_BE_ADDED: (username) => `${EMOJI.WAITING} User *${username}* will be added`,
  USERNAME_WAS_ADDED: (username) => `${EMOJI.SUCCESS} *${username}* was added\n`,
  USERNAME_WAS_NOT_ADDED: (username) => `${EMOJI.ERROR} *${username}* was not added\n`,
  USERNAME_WILL_BE_DELETED: (username) => `${EMOJI.WAITING} User *${username}* will be deleted`,
  USERNAME_WAS_DELETED: (username) => `${EMOJI.SUCCESS} User *${username}* was deleted`,
  // USERNAME_WAS_REFRESHED: (username) => `${EMOJI.SUCCESS} *${username}* was refreshed`,
  // USERNAME_WAS_NOT_REFRESHED: (username) => (
  //   `${EMOJI.ERROR} *${username}* was not refreshed`
  // ),

  // BIG TEXTS
  WELCOME_TEXT: (prefix) => `Welcome! This is Leetcode Rating bot Elite ${EMOJI.COOL} Boys
*${prefix}rating* - Overall rating
*${prefix}rating username* - Rating for separate user
*${prefix}refresh*  - Manual refresh of database.
*${prefix}add username1 username2*  ... - adding users`,
  USER_TEXT: (user) => `*Name:* ${user.name}
*Username:* ${user.username}
*Link:* *${user.link}*
*Solved:* ${user.solved} / ${user.all}

*Last ${user.submissions.length} Submissions:*
${user.submissions.map((submission) => `
*${submission.name}*
*Link:* *${LEETCODE_URL}${submission.link}*
*Status:* ${submission.status}
*Language:* ${submission.language}
*Time:* ${submission.time}
`).join('\n')}`,
  RATING_TEXT: (users) => {
    if (!users || users.length === 0) {
      return NO_USERS;
    }
    return users.map(
      (user, index) => (`${index + 1}. *${user.username}* ${user.solved}`),
    ).join('\n');
  },
};

module.exports = {
  BOT_MESSAGES,
  SERVER_MESSAGES,
};
