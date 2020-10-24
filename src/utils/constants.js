const dotenv = require('dotenv');

dotenv.config();

// ENV Variables
const {
  // Chatbot settings
  TELEGRAM_TOKEN,
  DISCORD_TOKEN,
  TELEGRAM_ENABLE,
  DISCORD_ENABLE,
  // Database settings
  DB_PROVIDER,
  // 1) MongoDB settings
  MONGO_DB_URL,
  MONGO_DB_NAME,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_AUTHENTICATION_ENABLED,
  // 2) Postgres settings
  POSTGRES_DB_URL,
  POSTGRES_DB_NAME,
  POSTGRES_DB_USER,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
  // System settings
  MASTER_PASSWORD,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DELAY_TIME_MS,
  NODE_SCHEDULE_TIME,
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

const MONGO = {
  DB_URL: MONGO_DB_URL,
  DB_NAME: MONGO_DB_NAME,
  DB_PORT: MONGO_DB_PORT,
  DB_PASSWORD: MONGO_DB_PASSWORD,
  DB_USER: MONGO_DB_USER,
  DB_AUTHENTICATION_ENABLED: MONGO_DB_AUTHENTICATION_ENABLED,
};

const POSTGRES = {
  DB_URL: POSTGRES_DB_URL,
  DB_NAME: POSTGRES_DB_NAME,
  DB_USER: POSTGRES_DB_USER,
  DB_PASSWORD: POSTGRES_DB_PASSWORD,
  DB_PORT: POSTGRES_DB_PORT,
};

module.exports = {
  // Chatbot data objects
  DISCORD,
  TELEGRAM,
  // Database settings
  DB_PROVIDER,
  MONGO,
  POSTGRES,
  // System settings
  MASTER_PASSWORD,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DELAY_TIME_MS,
  NODE_SCHEDULE_TIME,
  // Constants
  DATE_FORMAT,
  STATUS_MAP,
  EMOJI,
  STATUS,
};
