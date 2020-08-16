const moment = require('moment');
const DICT = require('./dictionary');

function log(...args) {
  // eslint-disable-next-line no-console
  console.log(...args);
}

function error(...args) {
  // eslint-disable-next-line no-console
  console.error(...args);
}

const refreshLog = () => {
  const date = moment().format('YYYY-MM-DD hh:mm a');
  log(`${DICT.DATABASE.IS_REFRESHED} ${date}`);
};

module.exports = { log, error, refreshLog };
