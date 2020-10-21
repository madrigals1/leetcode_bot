const schedule = require('node-schedule');

const User = require('../cache/user');

const startScheduler = () => {
  schedule.scheduleJob('*/30 * * * *', () => {
    User.refresh().then();
  });
};

module.exports = startScheduler;
