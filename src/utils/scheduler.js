const schedule = require('node-schedule');

const User = require('../cache/user');

const { NODE_SCHEDULE_TIME } = require('./constants');

const startScheduler = () => {
  schedule.scheduleJob(NODE_SCHEDULE_TIME, () => User.refresh().then());
};

module.exports = startScheduler;
