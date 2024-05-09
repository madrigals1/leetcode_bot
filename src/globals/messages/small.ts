import { constants } from '../constants';

const { EMOJI } = constants;

export class SmallMessages {
  static pong = 'pong';

  static helpText = (
    'Contact @madrigals1 in Telegram or madrigals1#9652 in Discord'
  );

  static noUsers = `${EMOJI.ERROR} No users found in database`;

  static noSubmissionsKey = 'no_submissions';

  static apiNotWorkingKey = 'api_not_working';

  static incorrectBotType = 'Incorrect bot type';
}
