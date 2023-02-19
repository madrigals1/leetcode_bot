import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class UserMessages {
  static userDoesNotExistInThisChannel(username: string): string {
    return `${EMOJI.ERROR} User <b>${username}</b> `
      + 'does not exist in this channel';
  }

  static usersAvatar(username: string): string {
    return `${username}'s avatar`;
  }

  static usersRecentSubmissions(username: string): string {
    return `${username}'s recent submissions`;
  }

  static usersSolvedProblemsChart(username: string): string {
    return `${username}'s solved problems chart`;
  }

  static selectLeftUser = `${EMOJI.PERSON} Select Left User`;

  static selectRightUser = `${EMOJI.PERSON} Select Right User`;

  static compareUsers(leftUsername: string, rightUsername: string): string {
    return `Comparing ${leftUsername} to ${rightUsername}`;
  }

  static userHasNoSubmissions(username: string): string {
    return `${EMOJI.ERROR} User <b>${username}</b> `
      + 'does not have any submissions';
  }

  // ---------------------------------------------------------------------------
  // ADD
  // ---------------------------------------------------------------------------
  static userIsSuccessfullyAdded(username: string): string {
    return `<b>${username}</b> - ${EMOJI.SUCCESS} User is successfully added\n`;
  }

  static userAlreadyExistsInThisChannel(username: string): string {
    return `<b>${username}</b> - ${EMOJI.ERROR} `
      + 'User already exists in this channel\n';
  }

  static userNotFoundInLeetcode(username: string): string {
    return `<b>${username}</b> - ${EMOJI.ERROR} User not found in Leetcode`;
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------
  static userIsSuccessfullyDeleted(username: string): string {
    return `${EMOJI.SUCCESS} User <b>${username}</b> was successfully deleted`;
  }

  static userWillBeDeleted(username: string): string {
    return `${EMOJI.WAITING} User <b>${username}</b> will be deleted`;
  }
}
