import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class RefreshMessages {
  static cacheStartedRefresh = `${EMOJI.WAITING} Cache refresh was `
    + 'requested...';

  static cacheIsRefreshed = `${EMOJI.SUCCESS} Cache is refreshed`;
}
