import { constants } from '../constants';

const { EMOJI } = constants;

export class ChannelMessages {
  static channelWillBeCleared = `${EMOJI.WASTEBASKET} Channel will be cleared`;

  static channelWasCleared = `${EMOJI.SUCCESS} Channel was cleared`;

  static channelWasNotCleared = `${EMOJI.ERROR} Channel was not cleared`;
}
