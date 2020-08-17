const dotenv = require('dotenv');

dotenv.config();

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

const DATE_FORMAT = 'YYYY-MM-DD hh:mm a';

const STATUS_MAP = {
  Accepted: '💚 Accepted',
  'Runtime Error': '🤣 Runtime Error',
  'Wrong Answer': '😢 Wrong Answer',
  'Time Limit Exceeded': '🤬 Time Limit Exceeded',
  'Memory Limit Exceeded': '🤔 Time Limit Exceeded',
  'Output Limit Exceeded': '😱 Output Limit Exceeded',
};

module.exports = {
  TELEGRAM_TOKEN,
  MASTER_PASSWORD,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DATE_FORMAT,
  STATUS_MAP,
};
