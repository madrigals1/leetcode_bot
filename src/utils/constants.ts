import * as dotenv from 'dotenv';

dotenv.config();

const {
  // ---------------------------------------------------------------------------
  // Chatbot settings
  // ---------------------------------------------------------------------------

  // Telegram
  TELEGRAM_TOKEN,
  TELEGRAM_TEST_TOKEN,

  // Slack
  SLACK_TOKEN,
  SLACK_TEST_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_TEST_SIGNING_SECRET,
  SLACK_APP_TOKEN,
  SLACK_TEST_APP_TOKEN,

  // Discord
  DISCORD_TOKEN,
  DISCORD_TEST_TOKEN,

  // ---------------------------------------------------------------------------
  // Database settings
  // ---------------------------------------------------------------------------

  // Database provider (sqlite3, mongo or postgres)
  DB_PROVIDER,

  // MongoDB
  MONGO_DB_URL,
  MONGO_DB_NAME,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_AUTHENTICATION_ENABLED,

  // Postgres
  POSTGRES_DB_URL,
  POSTGRES_DB_NAME,
  POSTGRES_DB_USER,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,

  // ---------------------------------------------------------------------------
  // MISC
  // ---------------------------------------------------------------------------

  // External Microservices
  VIZAPI_LINK,

  // Cumulative Rating Settings
  CML_EASY_POINTS,
  CML_MEDIUM_POINTS,
  CML_HARD_POINTS,

  // System settings
  MASTER_PASSWORD,
  LEETCODE_URL,
  USER_AMOUNT_LIMIT,
  USER_REQUEST_DELAY_MS,
  USERS_REFRESH_DELAY,
} = process.env;

const EMOJI = {
  ABACUS: '🧮',
  ERROR: '❗',
  CROSS_MARK: '❌',
  SUCCESS: '✅',
  WAITING: '⏳',
  WARNING: 'ℹ️',
  COOL: '😎',
  WASTEBASKET: '🗑️',
  PERSON: '👤',
  CLIPBOARD: '📋',
  BACK_ARROW: '🔙',
  GREEN_CIRCLE: '🟢',
  YELLOW_CIRCLE: '🟡',
  RED_CIRCLE: '🔴',
  BLUE_CIRCLE: '🔵',
  HEART: '💚',
  ROFL: '🤣',
  CRY: '😢',
  SWEAR: '🤬',
  THINK: '🤔',
  FEAR: '😱',
};

const SUBMISSION_STATUS_MAP = {
  Accepted: `${EMOJI.HEART} Accepted`,
  'Runtime Error': `${EMOJI.ROFL} Runtime Error`,
  'Compile Error': `${EMOJI.ROFL} Compile Error`,
  'Wrong Answer': `${EMOJI.CRY} Wrong Answer`,
  'Time Limit Exceeded': `${EMOJI.SWEAR} Time Limit Exceeded`,
  'Memory Limit Exceeded': `${EMOJI.THINK} Memory Limit Exceeded`,
  'Output Limit Exceeded': `${EMOJI.FEAR} Output Limit Exceeded`,
};

const STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
};

const CHAT_STATUS = {
  TYPING: 'typing',
};

const TELEGRAM = {
  NAME: 'telegram',
  ENABLE: !!TELEGRAM_TOKEN,
  TOKEN: TELEGRAM_TOKEN,
  TEST_ENABLE: !!TELEGRAM_TEST_TOKEN,
  TEST_TOKEN: TELEGRAM_TEST_TOKEN,
  PREFIX: '/',
};

const DISCORD = {
  NAME: 'discord',
  ENABLE: !!DISCORD_TOKEN,
  TOKEN: DISCORD_TOKEN,
  TEST_ENABLE: !!DISCORD_TEST_TOKEN,
  TEST_TOKEN: DISCORD_TEST_TOKEN,
  PREFIX: '!',
};

const SLACK = {
  NAME: 'slack',
  ENABLE: !!SLACK_TOKEN,
  TOKEN: SLACK_TOKEN,
  SIGNING_SECRET: SLACK_SIGNING_SECRET,
  APP_TOKEN: SLACK_APP_TOKEN,
  TEST_ENABLE: !!SLACK_TEST_TOKEN,
  TEST_TOKEN: SLACK_TEST_TOKEN,
  TEST_SIGNING_SECRET: SLACK_TEST_SIGNING_SECRET,
  TEST_APP_TOKEN: SLACK_TEST_APP_TOKEN,
  PREFIX: '/',
};

const MOCKBOT = {
  NAME: 'mockbot',
  PREFIX: '/',
};

const PROVIDERS = {
  TELEGRAM,
  DISCORD,
  SLACK,
  MOCKBOT,
};

const MONGO = {
  URL: MONGO_DB_URL,
  NAME: MONGO_DB_NAME,
  PORT: MONGO_DB_PORT,
  PASSWORD: MONGO_DB_PASSWORD,
  USER: MONGO_DB_USER,
  AUTHENTICATION_ENABLED: MONGO_DB_AUTHENTICATION_ENABLED,
};

const POSTGRES = {
  URL: POSTGRES_DB_URL,
  NAME: POSTGRES_DB_NAME,
  USER: POSTGRES_DB_USER,
  PASSWORD: POSTGRES_DB_PASSWORD,
  PORT: POSTGRES_DB_PORT,
};

const DATABASE = {
  MONGO,
  POSTGRES,
  PROVIDER: DB_PROVIDER || 'sqlite3',
};

const CML = {
  EASY_POINTS: Number(CML_EASY_POINTS || 1),
  MEDIUM_POINTS: Number(CML_MEDIUM_POINTS || 2),
  HARD_POINTS: Number(CML_HARD_POINTS || 3),
};

const SYSTEM = {
  MASTER_PASSWORD: MASTER_PASSWORD || 'admin',
  LEETCODE_URL: LEETCODE_URL || 'https://leetcode.com',
  USER_AMOUNT_LIMIT: parseInt(USER_AMOUNT_LIMIT, 10) || 30,
  USER_REQUEST_DELAY_MS: parseInt(USER_REQUEST_DELAY_MS, 10) || 4000,
  USERS_REFRESH_DELAY: USERS_REFRESH_DELAY || '*/30 * * * *',
  DATE_FORMAT: 'YYYY-MM-DD hh:mm a',
};

export default {
  PROVIDERS,
  DATABASE,
  CML,
  SYSTEM,
  VIZAPI_LINK,
  SUBMISSION_STATUS_MAP,
  EMOJI,
  STATUS,
  CHAT_STATUS,
};
