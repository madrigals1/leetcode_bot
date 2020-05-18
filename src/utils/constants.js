import dotenv from 'dotenv';

dotenv.config();

// ENV Variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const BABEL_ESLINT_PATH = process.env.BABEL_ESLINT_PATH || 'babel-eslint';
const LEETCODE_URL = process.env.LEETCODE_URL;
const MONGO_URL = process.env.MONGO_URL;

// Static variables
const welcome_message = `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;

export {
  TELEGRAM_TOKEN,
  MONGO_URL,
  BABEL_ESLINT_PATH,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  welcome_message,
};
