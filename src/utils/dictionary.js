const { LEETCODE_URL } = require('./constants');

const STATUS = {
  ERROR: {
    DEFAULT: 'Error',
    ON_THE_SERVER: 'Error on the server:',
    USERNAME_ALREADY_EXISTS: 'Username already exists in database',
    INCORRECT_INPUT: 'Incorrect input',
    USERNAME_NOT_FOUND: 'Error, caused by these:\n- Username is not added to database\n- Username'
      + 'does not exist',
    USERNAME_NOT_FOUND_ON_LEETCODE: 'Error, username is not found on LeetCode',
    PASSWORD_IS_INCORRECT: 'Password is incorrect',
  },
  SUCCESS: {
    DEFAULT: 'Success',
    ADDED_USER: 'Successfully added user',
    DELETED_USER: 'Successfully deleted user',
  },
};

const REFRESH = {
  IN_PROCESS: 'Refreshing',
  SUCCESS: 'Successfully refreshed',
  FAILURE: 'Failed refreshing',
  FINISHED: 'Finished refresh',
};

const MESSAGE = {
  AT_LEAST_1_USERNAME: 'Please, enter at least 1 username after /add command',
  USER_LIST: 'User List:\n',
  USERNAME_WAS_ADDED: (username) => `- ${username} was added\n`,
  USERNAME_WAS_NOT_ADDED: (username) => `- ${username} was not added\n`,
  USERNAME_WILL_BE_DELETED: (username) => `User ${username} will be deleted`,
  USERNAME_WAS_DELETED: (username) => `User ${username} was deleted`,
  USERNAME_WAS_REFRESHED: (username) => `- ${username} was refreshed`,
  USERNAME_WAS_NOT_REFRESHED: (username) => `- ${username} was not refreshed`,
};

const DATABASE = {
  NO_USERS: 'No users found in database!',
  USER_NOT_FOUND: 'User was not found!',
  USERS_ARE_REFRESHED: 'Users are refreshed',
  STARTED_REFRESH: 'Database started refresh',
  IS_REFRESHED: 'Database is refreshed',
  IS_ALREADY_REFRESHING: 'Database is already refreshing',
  CONNECTION_STATUS: {
    SUCCESSFUL: 'Database connection successful',
    ERROR: 'Database connection error',
  },
};

const WELCOME_TEXT = () => `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/rating username</i></b> - Rating for separate user
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;

const USER_TEXT = (user) => `<b>Name:</b> ${user.name}
<b>Username:</b> ${user.username}
<b>Link:</b> ${user.link}
<b>Solved:</b> ${user.solved} / ${user.all}

<b>Last ${user.submissions.length} Submissions:</b>
${user.submissions.map((submission) => `
<b>${submission.name}</b>
<b>Link:</b> ${LEETCODE_URL}${submission.link}
<b>Status:</b> ${submission.status}
<b>Language:</b> ${submission.language}
<b>Time:</b> ${submission.time}
`).join('\n')}`;

const RATING_TEXT = (users) => (
  users
    ? users.map((user, index) => `${index + 1}. <b>${user.username}</b> ${user.solved}\n`).join('')
    : DATABASE.NO_USERS
);

const TYPING = 'typing';

const DICT = {
  STATUS,
  REFRESH,
  MESSAGE,
  DATABASE,
  WELCOME_TEXT,
  USER_TEXT,
  RATING_TEXT,
  TYPING,
};

module.exports = DICT;
