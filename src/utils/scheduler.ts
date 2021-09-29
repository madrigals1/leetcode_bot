import * as schedule from 'node-schedule';

import Cache from '../cache';

import constants from './constants';

export function startScheduler(): void {
  schedule.scheduleJob(
    constants.SYSTEM.USERS_REFRESH_DELAY,
    () => Cache.refreshUsers(),
  );
}

export default startScheduler;
