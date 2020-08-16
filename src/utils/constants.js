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

module.exports = {
  TELEGRAM_TOKEN,
  MASTER_PASSWORD,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  SUBMISSION_COUNT,
  DATE_FORMAT,
};
