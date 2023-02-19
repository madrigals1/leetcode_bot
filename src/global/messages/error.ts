import { ChannelKey } from '../../cache/models';
import { constants } from '../constants';

const { EMOJI } = constants;

export class ErrorMessages {
  static errorOnTheServer(error?: Error | string) {
    if (error) {
      return `${EMOJI.ERROR} Error on the server: ${error}`;
    }

    return `${EMOJI.ERROR} Error on the server`;
  }

  static unknownError(username: string): string {
    return `<b>${username}</b> - ${EMOJI.ERROR} Error on the server`;
  }

  static youNeedAdminRights = `${EMOJI.ERROR} You need administrator priveleges to `
    + 'execute this action';

  static incorrectRatingType = `${EMOJI.ERROR} Incorrect rating type`;

  static noUsersFoundInDatabase = `${EMOJI.ERROR} No users found in database`;

  static channelDoesNotExist(channelKey: ChannelKey) {
    return `Channel does not exist - ${channelKey}`;
  }
}
