const dotenv = require('dotenv');

dotenv.config();

const STATUS = {
  ERROR: {
    DEFAULT: 'Error',
    ON_THE_SERVER: 'Error on the server:',
    INCORRECT_INPUT: 'Incorrect input',
    USERNAME_NOT_FOUND: 'Error, caused by these:\n- Username is not added to database\n- Username'
    + 'does not exist',
    PASSWORD_IS_INCORRECT: 'Password is incorrect',
  },
  SUCCESS: 'Success',
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
};
const DATABASE = {
  NO_USERS: 'No users found in database!',
  USERS_ARE_REFRESHED: 'Users are refreshed',
  STARTED_REFRESH: 'Database started refresh',
  IS_REFRESHED: 'Database is refreshed',
  IS_ALREADY_REFRESHING: 'Database is already refreshing',
  CONNECTION_STATUS: {
    SUCCESSFUL: 'Database connection successful',
    ERROR: 'Database connection error',
  },
};

const DICT = {
  STATUS,
  REFRESH,
  MESSAGE,
  DATABASE,
};

// ENV Variables
const {
  TELEGRAM_TOKEN,
  MASTER_PASSWORD,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  MONGO_URL,
  SUBMISSION_COUNT,
} = process.env;

module.exports = {
  TELEGRAM_TOKEN,
  MASTER_PASSWORD,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DICT,
};
