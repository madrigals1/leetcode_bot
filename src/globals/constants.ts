import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

import { ChatbotProvider } from '../chatbots/models';

dotenv.config();

const {
  // ---------------------------------------------------------------------------
  // Chatbot settings
  // ---------------------------------------------------------------------------

  // Telegram
  TELEGRAM_TOKEN,
  TELEGRAM_BOT_NAME,

  // Slack
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_APP_TOKEN,

  // Discord
  DISCORD_TOKEN,
  DISCORD_APP_ID,
  DISCORD_GUILD_ID,

  // LeetCode BOT Backend
  LBB_URL,
  LBB_USERNAME,
  LBB_PASSWORD,

  // REST
  PORT,

  // ---------------------------------------------------------------------------
  // MISC
  // ---------------------------------------------------------------------------

  // External Microservices
  VIZAPI_LINK,

  // Cumulative Rating Settings
  CML_EASY_POINTS,
  CML_MEDIUM_POINTS,
  CML_HARD_POINTS,
} = process.env;

const EMOJI = {
  ABACUS: '🧮',
  ERROR: '❗',
  CROSS_MARK: '❌',
  SUCCESS: '✅',
  WAITING: '⏳',
  COOL: '😎',
  WASTEBASKET: '🗑️',
  CHART: '📊',
  PERSON: '👤',
  CLIPBOARD: '📋',
  BACK_ARROW: '🔙',
  GREEN_CIRCLE: '🟢',
  YELLOW_CIRCLE: '🟡',
  RED_CIRCLE: '🔴',
  BLUE_CIRCLE: '🔵',
  BLUE_DIAMOND: '🔷',
  HEART: '💚',
  ROFL: '🤣',
  CRY: '😢',
  SWEAR: '🤬',
  THINK: '🤔',
  FEAR: '😱',
  PROGRAMMER: '👨‍💻',
  BELL: '🔔',
  CAMERA: '📷',
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

const TYPING: TelegramBot.ChatAction = 'typing';

const CHAT_STATUS = {
  TYPING,
};

const TELEGRAM = {
  ID: ChatbotProvider.Telegram,
  NAME: 'Telegram',
  ENABLE: !!TELEGRAM_TOKEN,
  TOKEN: TELEGRAM_TOKEN,
  PREFIX: '/',
  BOT_NAME: TELEGRAM_BOT_NAME,
};

const DISCORD = {
  ID: ChatbotProvider.Discord,
  NAME: 'Discord',
  ENABLE: !!DISCORD_TOKEN,
  TOKEN: DISCORD_TOKEN,
  APP_ID: DISCORD_APP_ID,
  GUILD_ID: DISCORD_GUILD_ID,
  PREFIX: '/',
};

const SLACK = {
  ID: ChatbotProvider.Slack,
  NAME: 'Slack',
  ENABLE: !!SLACK_TOKEN,
  TOKEN: SLACK_TOKEN,
  SIGNING_SECRET: SLACK_SIGNING_SECRET,
  APP_TOKEN: SLACK_APP_TOKEN,
  PREFIX: '/',
};

const MOCKBOT = {
  ID: ChatbotProvider.Mockbot,
  NAME: 'Mockbot',
  PREFIX: '/',
};

const PROVIDERS = {
  TELEGRAM,
  DISCORD,
  SLACK,
  MOCKBOT,
};

const CML = {
  EASY_POINTS: Number(CML_EASY_POINTS || 1),
  MEDIUM_POINTS: Number(CML_MEDIUM_POINTS || 2),
  HARD_POINTS: Number(CML_HARD_POINTS || 3),
};

const SYSTEM = {
  DATE_FORMAT: 'YYYY-MM-DD hh:mm a',
};

const LBB = {
  URL: LBB_URL,
  USERNAME: LBB_USERNAME,
  PASSWORD: LBB_PASSWORD,
};

export const constants = {
  PROVIDERS,
  LBB,
  PORT,
  CML,
  SYSTEM,
  VIZAPI_LINK,
  SUBMISSION_STATUS_MAP,
  EMOJI,
  CHAT_STATUS,
};
