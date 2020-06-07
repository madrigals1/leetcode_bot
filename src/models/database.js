const mongoose = require('mongoose');

const { DB_NAME, DB_PORT, MONGO_URL } = require('../utils/constants');
const { log, error } = require('../utils/helper');

const server = `${MONGO_URL}:${DB_PORT}`;
const users = [];

const connect = () => {
  mongoose
    .connect(`mongodb://${server}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      log('Database connection successful');
    })
    .catch((err) => {
      error('Database connection error', err);
    });
};

module.exports = {
  connect,
  users,
};
