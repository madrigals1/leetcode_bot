import { ArgumentsError, InputError } from '../../utils/errors';
import ArgumentManager from '../argumentManager';
import { Argument, ParsedArgument } from '../decorators/models';
import { Context } from '../models';

// Change bold, italic and code from HTML to Markdown
export function formatMessage(message: string): string {
  return message
    .replace(/<b>|<\/b>/g, '**')
    .replace(/<i>|<\/i>/g, '*')
    .replace(/<code>|<\/code>/g, '`');
}

export function reply(message: string, context: Context): Promise<string> {
  // Get channel from context
  const { discordIReply: ireply } = context;

  // Format message to Markdown style, requested by Discord
  const formattedMessage: string = formatMessage(message);

  // Send message back to channel
  return new Promise((resolve) => {
    ireply(formattedMessage);
    resolve(formattedMessage);
  });
}

export function getKeyBasedParsedArguments(
  context: Context, requestedArgs: Argument[],
): ArgumentManager {
  const argumentManager = new ArgumentManager();
  const { discordProvidedArguments: providedArguments } = context;

  requestedArgs.forEach((argument: Argument) => {
    // Find argument in provided arguments
    const foundArgument = providedArguments.find(
      (providedArgument) => (providedArgument.name === argument.key),
    );

    // If argument was not found
    if (!foundArgument) {
      // If argument was required, throw an error
      if (argument.isRequired) {
        const reason = `Required argument ${argument.key} was not provided`;
        throw new InputError(reason);
      }

      // Add optional argument with empty value
      argumentManager.upsert(new ParsedArgument(
        argument.index,
        argument.key,
        argument.name,
        argument.isMultiple ? [] : '',
      ));
      // If argument was found
    } else {
      const getValue = (isMultiple: boolean): string | string[] => {
        const { value } = foundArgument;

        switch (typeof value) {
          case 'string':
            return isMultiple ? value.split(' ') : value;
          case 'number':
            return isMultiple ? [`${value}`] : `${value}`;
          case 'boolean':
            return isMultiple ? [`${value}`] : `${value}`;
          default:
            throw new ArgumentsError(`Invalid argument type provided from Discord: ${typeof value}`);
        }
      };

      // Add optional argument with empty value
      argumentManager.upsert(new ParsedArgument(
        argument.index,
        argument.key,
        argument.name,
        getValue(argument.isMultiple),
      ));
    }
  });

  return argumentManager;
}
