const schedule = require('node-schedule');

const { refreshLog } = require('./helper');
const { refreshUsers } = require('../models/system');

const startScheduler = () => {
  schedule.scheduleJob('*/15 * * * *', () => {
    refreshUsers().then(refreshLog);
  });
};

module.exports = startScheduler;
