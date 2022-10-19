export class ImageMessages {
  static imageWasCreated = 'The image was created';

  static imageWasNotCreated(err: Error | string): string {
    return `The image was NOT created: ${err}`;
  }
}
