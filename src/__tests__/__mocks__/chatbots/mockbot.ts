import { Context } from '../../../chatbots/models';
import Actions, { registeredActions } from '../../../chatbots/actions';

export default class Mockbot {
  output: string;

  name = 'Mockbot';

  prefix = '/';

  gus = 'Man';

  async send(message: string): Promise<void> {
    // If message is not command, ignore it
    if (!message.startsWith(this.prefix)) return;

    // Turn "/rating username arg1" into ["rating", "username", "arg1"]
    const args: string[] = message
      .slice(this.prefix.length)
      .trim()
      .split(' ');

    // Get command and arguments from args list
    const command: string = args[0];

    // Find appropriate action by name and execute it
    for (let i = 0; i < registeredActions.length; i++) {
      const { name, property } = registeredActions[i];

      if (name === command) {
        const context: Context = {
          text: message,
          reply: (msg): Promise<string> => new Promise((resolve) => {
            this.setOutput(msg);
            return resolve('');
          }),
          provider: this.name,
          chatId: 123123123,
          prefix: this.prefix,
          options: {},
        };

        // eslint-disable-next-line no-await-in-loop
        await Actions[property](context);

        // Stop searching after action is found
        break;
      }
    }
  }

  receive(): string {
    return this.output;
  }

  setOutput(message: string): void {
    this.output = message;
  }

  clear(): void {
    this.output = null;
  }
}
