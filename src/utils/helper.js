const moment = require('moment');

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
  log(`Database is refreshed ${date}`);
};

module.exports = { log, error, refreshLog };
