const schedule = require('node-schedule');

const { refreshLog } = require('./helper');
const User = require('../repository/user');

const startScheduler = () => {
  schedule.scheduleJob('*/30 * * * *', () => {
    User.refresh().then(refreshLog);
  });
};

module.exports = startScheduler;
