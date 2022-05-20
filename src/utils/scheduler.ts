import * as schedule from 'node-schedule';

import { UserCache } from '../cache/userCache';

import { constants } from './constants';

export function refreshUsersCron(): void {
  schedule.scheduleJob(
    constants.SYSTEM.USERS_REFRESH_DELAY,
    () => UserCache.refresh(),
  );
}
