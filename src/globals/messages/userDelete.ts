import { constants } from '../constants';

const { EMOJI } = constants;

export class UserDeleteMessages {
  static success(username: string): string {
    const emoji = EMOJI.SUCCESS;
    const user = `User <b>${username}</b>`;
    const message = 'was successfully deleted';
    return `${emoji} ${user} ${message}`;
  }

  static willBeDeleted(username: string): string {
    const emoji = EMOJI.WAITING;
    const user = `User <b>${username}</b>`;
    const message = 'will be deleted';
    return `${emoji} ${user} ${message}`;
  }
}
