import * as schedule from 'node-schedule';

import Cache from '../cache';

import constants from './constants';

export function startScheduler(): void {
  schedule.scheduleJob(
    constants.SYSTEM.NODE_SCHEDULE_TIME,
    () => Cache.refreshUsers(),
  );
}

export default startScheduler;
