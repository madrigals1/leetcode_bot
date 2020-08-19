const moment = require('moment');
const DICT = require('./dictionary');

const isRegexMatchInArray = (value, array) => (
  array.filter((regex) => value.match(regex)).length > 0
);

const log = (...args) => {
  // eslint-disable-next-line no-console
  console.log(...args);
};

const error = (...args) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

const refreshLog = () => {
  const date = moment().format('YYYY-MM-DD hh:mm a');
  log(`${DICT.DATABASE.IS_REFRESHED} ${date}`);
};

const delay = (msTime) => new Promise((res) => setTimeout(res, msTime));

module.exports = {
  log, error, refreshLog, isRegexMatchInArray, delay,
};
