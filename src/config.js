const dotenv = require("dotenv");
dotenv.config();
const token = process.env.TOKEN;
const mongoURL = process.env.MONGO_URL || 'localhost';

module.exports = {token, mongoURL};