import schedule from 'node-schedule';

import User from '../cache/user';

import constants from './constants';

const startScheduler = () => {
  schedule.scheduleJob(
    constants.NODE_SCHEDULE_TIME,
    () => User.refresh().then(),
  );
};

export default startScheduler;
