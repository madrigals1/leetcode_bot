import { constants } from '../constants';

const { EMOJI } = constants;

export class RefreshMessages {
  static startedRefresh = `${EMOJI.WAITING} Refresh was requested...`;

  static isRefreshed = `${EMOJI.SUCCESS} Refresh is finished`;
}
