import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class ErrorMessages {
  static server(error?: Error | string) {
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
}
