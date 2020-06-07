const dotenv = require('dotenv');

dotenv.config();

// ENV Variables
const {
  TELEGRAM_TOKEN,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  MONGO_URL,
  SUBMISSION_COUNT,
} = process.env;

module.exports = {
  TELEGRAM_TOKEN,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  SUBMISSION_COUNT,
};
