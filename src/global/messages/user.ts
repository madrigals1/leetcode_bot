import { LBBUsernameResponse } from '../../backend/models';
import { constants } from '../../utils/constants';

import { ErrorMessages } from './error';

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

  static isSuccessfullyAdded(username: string): string {
    const message = `${EMOJI.SUCCESS} User is successfully added`;
    return `<b>${username}</b> - ${message}\n`;
  }

  static alreadyExistsInThisChannel(username: string): string {
    const message = `${EMOJI.ERROR} User already exists in this channel`;
    return `<b>${username}</b> - ${message}\n`;
  }

  static notFoundInLeetcode(username: string): string {
    const message = `${EMOJI.ERROR} User not found in Leetcode`;
    return `<b>${username}</b> - ${message}`;
  }

  static unknownError(username: string): string {
    const message = `${EMOJI.ERROR} Error on the server`;
    return `<b>${username}</b> - ${message}`;
  }

  static userListText(data: LBBUsernameResponse[]|string): string {
    if (typeof data === 'string') {
      return `User List:\n${data}`;
    }

    if (!data) {
      return ErrorMessages.server();
    }

    const message = data
      .map((res) => this[res.detail](res.username))
      .join('\n');

    return `User List:\n${message}`;
  }
}
