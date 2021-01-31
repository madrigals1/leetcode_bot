import schedule from 'node-schedule';

import Cache from '../cache';

import constants from './constants';

const startScheduler = () => {
  schedule.scheduleJob(
    constants.NODE_SCHEDULE_TIME,
    () => Cache.refreshUsers().then(),
  );
};

export default startScheduler;
