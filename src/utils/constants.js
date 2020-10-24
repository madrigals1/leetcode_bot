const dotenv = require('dotenv');

dotenv.config();

// ENV Variables
const {
  TELEGRAM_TOKEN,
  DISCORD_TOKEN,
  TELEGRAM_ENABLE,
  DISCORD_ENABLE,
  MASTER_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  LEETCODE_URL,
  MONGO_URL,
  SUBMISSION_COUNT,
  DELAY_TIME_MS,
  DB_AUTHENTICATION_ENABLED,
} = process.env;

const DATE_FORMAT = 'YYYY-MM-DD hh:mm a';

const STATUS_MAP = {
  Accepted: '💚 Accepted',
  'Runtime Error': '🤣 Runtime Error',
  'Wrong Answer': '😢 Wrong Answer',
  'Time Limit Exceeded': '🤬 Time Limit Exceeded',
  'Memory Limit Exceeded': '🤔 Time Limit Exceeded',
  'Output Limit Exceeded': '😱 Output Limit Exceeded',
};

const EMOJI = {
  ERROR: '❗',
  CROSS_MARK: '❌',
  SUCCESS: '✅',
  WAITING: '⏳',
  WARNING: '⚠️',
  COOL: '😎',
  WASTEBASKET: '🗑️',
  CARD_FILE_BOX: '🗃️',
};

const STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  TYPING: 'typing',
};

const TELEGRAM = {
  ENABLE: TELEGRAM_ENABLE,
  TOKEN: TELEGRAM_TOKEN,
  PREFIX: '/',
};

const DISCORD = {
  ENABLE: DISCORD_ENABLE,
  TOKEN: DISCORD_TOKEN,
  PREFIX: '!',
};

module.exports = {
  TELEGRAM_TOKEN,
  DISCORD,
  TELEGRAM,
  MASTER_PASSWORD,
  MONGO_URL,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DATE_FORMAT,
  STATUS_MAP,
  DELAY_TIME_MS,
  EMOJI,
  STATUS,
  DB_AUTHENTICATION_ENABLED,
};
