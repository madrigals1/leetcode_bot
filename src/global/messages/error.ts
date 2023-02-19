import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class ErrorMessages {
  static server(error?: Error | string) {
    if (error) {
      return `${EMOJI.ERROR} Error on the server: ${error}`;
    }

    return `${EMOJI.ERROR} Error on the server`;
  }
}
