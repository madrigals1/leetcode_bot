import * as dotenv from 'dotenv';

dotenv.config();

// ENV Variables
const {
  // Chatbot settings
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
  // External Microservices
  VIZAPI_LINK,
  // System settings
  MASTER_PASSWORD,
  LEETCODE_URL,
  USER_AMOUNT_LIMIT,
  DELAY_TIME_MS,
  NODE_SCHEDULE_TIME,
} = process.env;

const DATE_FORMAT = 'YYYY-MM-DD hh:mm a';

const EMOJI = {
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

const STATUS_MAP = {
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

const DB = {
  MONGO,
  POSTGRES,
};

export default {
  PROVIDERS,
  // Database settings
  DB,
  DB_PROVIDER,
  // System settings
  MASTER_PASSWORD: MASTER_PASSWORD || 'admin',
  LEETCODE_URL: LEETCODE_URL || 'https://leetcode.com',
  USER_AMOUNT_LIMIT: parseInt(USER_AMOUNT_LIMIT, 10) || 30,
  DELAY_TIME_MS: parseInt(DELAY_TIME_MS, 10) || 4000,
  NODE_SCHEDULE_TIME: NODE_SCHEDULE_TIME || '*/30 * * * *',
  // External Microservices
  VIZAPI_LINK,
  // Constants
  DATE_FORMAT,
  STATUS_MAP,
  EMOJI,
  STATUS,
};
