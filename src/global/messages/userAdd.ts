import { LBBUsernameResponse } from '../../backend/models';
import { constants } from '../../utils/constants';

import { ErrorMessages } from './error';

const { EMOJI } = constants;

export class UserAddMessages {
  static success(username: string): string {
    const message = `${EMOJI.SUCCESS} User is successfully added`;
    return `<b>${username}</b> - ${message}\n`;
  }

  static alreadyExists(username: string): string {
    const message = `${EMOJI.ERROR} User already exists in this channel`;
    return `<b>${username}</b> - ${message}\n`;
  }

  static leetcodeNotFoundUsername(username: string): string {
    const message = `${EMOJI.ERROR} User not found in Leetcode`;
    return `<b>${username}</b> - ${message}`;
  }

  static leetcodeUnknownError(username: string): string {
    const message = `${EMOJI.ERROR} Unknown error on Leetcode side`;
    return `<b>${username}</b> - ${message}`;
  }

  static unknownError(username: string): string {
    const message = `${EMOJI.ERROR} Error on the server`;
    return `<b>${username}</b> - ${message}`;
  }

  static userList(data: LBBUsernameResponse[]|string): string {
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
