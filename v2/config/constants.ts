import * as dotenv from 'dotenv';

dotenv.config();

const {
  // Telegram
  TELEGRAM_TOKEN,
  TELEGRAM_BOT_NAME,
} = process.env;

const TELEGRAM = {
  ENABLE: !!TELEGRAM_TOKEN,
  TOKEN: TELEGRAM_TOKEN,
  BOT_NAME: TELEGRAM_BOT_NAME,
};

export const constants = {
  TELEGRAM,
};
