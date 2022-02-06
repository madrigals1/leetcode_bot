import { Context } from '../../../chatbots/models';
import Actions, { registeredActions } from '../../../chatbots/actions';
import { constants } from '../../../utils/constants';
import {
  getPositionalParsedArguments,
} from '../../../chatbots/decorators/utils';
import { ChatbotProvider } from '../../../chatbots';

export default class Mockbot {
  output: string[] = [];

  context: Context;

  id = constants.PROVIDERS.MOCKBOT.ID;

  prefix = constants.PROVIDERS.MOCKBOT.PREFIX;

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
          reply: (msg: string, ctx: Context): Promise<string> => {
            const promise: Promise<string> = new Promise((resolve) => {
              this.setOutput(msg);
              this.setContext(ctx);
              return resolve('');
            });

            return promise;
          },
          argumentParser: getPositionalParsedArguments,
          provider: this.id,
          chatId: 123123123,
          prefix: this.prefix,
          channelKey: {
            chatId: 'unique_chat_id',
            provider: ChatbotProvider.Mockbot,
          },
          options: {},
        };

        // eslint-disable-next-line no-await-in-loop
        await Actions[property](context);

        // Stop searching after action is found
        break;
      }
    }
  }

  messages(amount: number = this.output.length): string[] {
    return this.output.slice(this.output.length - amount, this.output.length);
  }

  lastMessage(): string {
    return this.output[this.output.length - 1];
  }

  setOutput(message: string): void {
    this.output.push(message);
  }

  setContext(context: Context): void {
    this.context = context;
  }

  getContext(): Context {
    return this.context;
  }

  clear(): void {
    this.output = [];
    this.context = null;
  }
}
