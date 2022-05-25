import { constants } from '../../utils/constants';

const { EMOJI } = constants;

export class ArgumentMessages {
  static insufficientArgsInMessage =
    `${EMOJI.ERROR} Insufficient arguments in message`;

  static shouldNotRequestMoreThan100Args =
    `${EMOJI.ERROR} Should not request more than 100 arguments`;

  static shouldNotProvideMoreThan100Args =
    `${EMOJI.ERROR} Should not provide more than 100 arguments`;

  static requiredArgXWasNotProvided(name: string): string {
    return `${EMOJI.ERROR} Required argument ${name} was not provided`;
  }

  static invalidArgTypeProvidedFromDiscord(value: unknown): string {
    return `Invalid argument type provided from Discord: ${typeof value}`;
  }

  static duplicateKeysInArgs(keys: string[]): string {
    return `${EMOJI.ERROR} Duplicate keys ${keys} are found in arguments`;
  }

  static duplicateIndexesInArgs(keys: number[]): string {
    return `${EMOJI.ERROR} Duplicate indexes ${keys} are found in arguments`;
  }

  static shouldNotHaveRequiredArgsAfterOptional =
    `${EMOJI.ERROR} Should not have required arguments after optional `
      + 'arguments';

  static messageShouldHaveNoArgs =
    `${EMOJI.ERROR} Message should not have any arguments`;

  static indexShouldBePresentInArgs(i: number): string {
    return `${EMOJI.ERROR} Index ${i} should be present in arguments`;
  }

  static argIsNotProvided(i: number): string {
    return `${EMOJI.ERROR} Argument ${i} is not provided`;
  }
}
