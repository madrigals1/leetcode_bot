import { Options } from '../../../chatbots/models';

export class MockBotDiscord {
  formattedMessage = '';

  options: Options = {};

  send(message: string, options: Options = {}): void {
    this.formattedMessage = message;
    this.options = options;
  }
}
