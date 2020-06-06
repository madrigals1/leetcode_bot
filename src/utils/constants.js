const dotenv = require('dotenv');

dotenv.config();

// ENV Variables
const {
  TELEGRAM_TOKEN,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  MONGO_URL,
} = process.env;

// Static variables
const welcomeMessage = `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/rating username</i></b> - Rating for separate user
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;

module.exports = {
  TELEGRAM_TOKEN,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  welcomeMessage,
};
