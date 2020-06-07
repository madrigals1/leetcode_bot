const moment = require('moment');

function log(...args) {
  console.log(...args);
}

function error(...args) {
  console.error(...args);
}

const refreshLog = () => {
  const date = moment().format('YYYY-MM-DD hh:mm a');
  console.log(`Database is refreshed ${date}`);
};

module.exports = { log, error, refreshLog };
