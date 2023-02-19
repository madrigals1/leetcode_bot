import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class RefreshMessages {
  static refreshWasRequested = `${EMOJI.WAITING} Refresh was requested...`;

  static usernameWasRefreshed(username: string) {
    return `${username} was refreshed`;
  }

  static usernameWasNotRefreshed(username: string) {
    return `${username} was not refreshed`;
  }

  static databaseRequestedRefresh(time: string) {
    return `Database requested refresh at ${time}`;
  }

  // ---------------------------------------------------------------------------
  // CACHE
  // ---------------------------------------------------------------------------

  static cacheRefreshWasRequested = `${EMOJI.WAITING
  } Cache refresh was requested...`;

  static cacheAlreadyRefreshed = `${EMOJI.ERROR
  } Cache was refreshed less than 5 minutes ago`;

  static cacheIsRefreshed = `${EMOJI.SUCCESS
  } Cache is refreshed`;
}
