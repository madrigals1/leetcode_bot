import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class ClearMessages {
  static channelWillBeCleared = `${EMOJI.WASTEBASKET} Channel will be cleared`;

  static channelWasCleared = `${EMOJI.SUCCESS} Channel was cleared`;

  static channelWasNotCleared = `${EMOJI.ERROR} Channel was not cleared`;
}
