import { ChannelKey } from '../../cache/models';
import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class SmallMessages {
  static pong = 'pong';

  static helpText = (
    'Contact @madrigals1 in Telegram or madrigals1#9652 in Discord'
  );

  static noUsers = `${EMOJI.ERROR} No users found in database`;

  static noSubmissions = 'no_submissions';

  static apiNotWorking = 'api_not_working';

  static incorrectBotType = 'Incorrect bot type';

  static isConnectingTo(entity: string): string {
    return `>>> Connecting to ${entity}`;
  }

  // Channel errors
  static channelDoesNotExist(channelKey: ChannelKey) {
    // eslint-disable-next-line implicit-arrow-linebreak
    return `Channel does not exist - ${channelKey}`;
  }
}
