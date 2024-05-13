export class ArgumentInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArgumentInputError';
  }
}

export class ArgumentSetupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArgumentSetupError';
  }
}
