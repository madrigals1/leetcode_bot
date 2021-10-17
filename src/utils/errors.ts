import constants from './constants';

export class InputError extends Error {
  constructor(message: string) {
    super(`${constants.EMOJI.ERROR} ${message}`);
    this.name = 'InvalidInputError';
  }
}

export class ArgumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentsError';
  }
}
