import * as dotenv from 'dotenv';

import { isTrue } from './helper';

dotenv.config();

// Emoji
const EMOJI = {
  ERROR: '❗',
  CROSS_MARK: '❌',
  SUCCESS: '✅',
  WAITING: '⏳',
  STRONG: '🦾',
  JOKE: '🤣',
  CRY: '😢',
  THINK: '🤔',
  FEAR: '😱',
  INVALID: '👨‍🦼',
  WARNING: '⚠️',
  COOL: '😎',
  WASTEBASKET: '🗑️',
  CARD_FILE_BOX: '🗃️',
  USER_WITH_LAPTOP: '👨‍💻',
  PEOPLE: '👥',
  SCROLL: '📜',
  BACK_ARROW: '🔙',
  GREEN_SQUARE: '🟩',
  YELLOW_SQUARE: '🟨',
  RED_SQUARE: '🟥',
  BLUE_SQUARE: '🟦',
};

// ENV Variables
const {
  // Chatbot settings
  // Telegram
  TELEGRAM_TOKEN,
  TELEGRAM_TEST_TOKEN,
  TELEGRAM_ENABLE,
  TELEGRAM_TEST_ENABLE,
  // Slack
  SLACK_TOKEN,
  SLACK_TEST_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_TEST_SIGNING_SECRET,
  SLACK_ENABLE,
  SLACK_TEST_ENABLE,
  SLACK_APP_TOKEN,
  SLACK_TEST_APP_TOKEN,
  // Discord
  DISCORD_TOKEN,
  DISCORD_TEST_TOKEN,
  DISCORD_ENABLE,
  DISCORD_TEST_ENABLE,
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
  SUBMISSION_COUNT,
  USER_AMOUNT_LIMIT,
  DELAY_TIME_MS,
  NODE_SCHEDULE_TIME,
} = process.env;

const DATE_FORMAT = 'YYYY-MM-DD hh:mm a';

const STATUS_MAP = {
  Accepted: `${EMOJI.STRONG} Accepted`,
  'Runtime Error': `${EMOJI.JOKE} Runtime Error`,
  'Compile Error': `${EMOJI.JOKE} Compile Error`,
  'Wrong Answer': `${EMOJI.CRY} Wrong Answer`,
  'Time Limit Exceeded': `${EMOJI.INVALID} Time Limit Exceeded`,
  'Memory Limit Exceeded': `${EMOJI.THINK} Time Limit Exceeded`,
  'Output Limit Exceeded': `${EMOJI.FEAR} Output Limit Exceeded`,
};

const STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  TYPING: 'typing',
};

const TELEGRAM = {
  NAME: 'telegram',
  ENABLE: TELEGRAM_ENABLE,
  TOKEN: TELEGRAM_TOKEN,
  TEST_ENABLE: TELEGRAM_TEST_ENABLE,
  TEST_TOKEN: TELEGRAM_TEST_TOKEN,
  PREFIX: '/',
};

const DISCORD = {
  NAME: 'discord',
  ENABLE: isTrue(DISCORD_ENABLE),
  TOKEN: DISCORD_TOKEN,
  TEST_ENABLE: DISCORD_TEST_ENABLE,
  TEST_TOKEN: DISCORD_TEST_TOKEN,
  PREFIX: '!',
};

const SLACK = {
  NAME: 'slack',
  ENABLE: isTrue(SLACK_ENABLE),
  TOKEN: SLACK_TOKEN,
  SIGNING_SECRET: SLACK_SIGNING_SECRET,
  APP_TOKEN: SLACK_APP_TOKEN,
  TEST_ENABLE: SLACK_TEST_ENABLE,
  TEST_TOKEN: SLACK_TEST_TOKEN,
  TEST_SIGNING_SECRET: SLACK_TEST_SIGNING_SECRET,
  TEST_APP_TOKEN: SLACK_TEST_APP_TOKEN,
  PREFIX: '/',
};

const PROVIDERS = [
  TELEGRAM,
  DISCORD,
];

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

export default {
  // Chatbot data objects
  DISCORD,
  TELEGRAM,
  SLACK,
  PROVIDERS,
  // Database settings
  DB_PROVIDER,
  MONGO,
  POSTGRES,
  // System settings
  MASTER_PASSWORD,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  USER_AMOUNT_LIMIT,
  DELAY_TIME_MS,
  NODE_SCHEDULE_TIME,
  // External Microservices
  VIZAPI_LINK,
  // Constants
  DATE_FORMAT,
  STATUS_MAP,
  EMOJI,
  STATUS,
};
