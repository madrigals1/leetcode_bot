import { constants } from '../constants';

const { EMOJI } = constants;

export class UserMessages {
  static doesNotExist(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not exist in this channel';
    return `${emoji} ${user} ${message}`;
  }

  static avatar = `${EMOJI.CAMERA} Avatar`;

  static usernamesAvatar(username: string): string {
    return `${username}'s avatar`;
  }

  static recentSubmissions(username: string): string {
    return `${username}'s recent submissions`;
  }

  static solvedProblemsChart(username: string): string {
    return `${username}'s solved problems chart`;
  }

  static selectLeftUser = `${EMOJI.PERSON} Select Left User`;

  static selectRightUser = `${EMOJI.PERSON} Select Right User`;

  static compare(leftUsername: string, rightUsername: string): string {
    return `Comparing ${leftUsername} to ${rightUsername}`;
  }

  static noAdminRights = `${EMOJI.ERROR} You need administrator priveleges to `
    + 'execute this action';

  static noSubmissions(username: string): string {
    const emoji = EMOJI.ERROR;
    const user = `User <b>${username}</b>`;
    const message = 'does not have any submissions';

    return `${emoji} ${user} ${message}`;
  }
}
