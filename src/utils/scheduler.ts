import * as schedule from 'node-schedule';

import { UserCache } from '../cache/userCache';
import { constants } from '../global/constants';

export function refreshUsersCron(): void {
  schedule.scheduleJob(
    constants.SYSTEM.USERS_REFRESH_DELAY,
    () => UserCache.refresh(),
  );
}

export default refreshUsersCron;
