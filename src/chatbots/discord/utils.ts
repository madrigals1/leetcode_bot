import {
  MessageActionRow,
  MessageButton,
  MessageOptions,
  MessageSelectMenu,
} from 'discord.js';

import { ArgumentsError, InputError } from '../../utils/errors';
import ArgumentManager from '../argumentManager';
import { Argument, ParsedArgument } from '../decorators/models';
import { Context, ButtonContainer } from '../models';

import buttonIndexer from './buttonIndexer';

export function getButtonComponents(
  buttonContainers: ButtonContainer[],
): MessageActionRow[] {
  const rows: MessageActionRow[] = [];

  buttonContainers?.forEach((buttonContainer) => {
    const { buttons } = buttonContainer;

    const components = [];

    switch (buttons.length) {
      case 1:
        components.push(
          new MessageButton()
            .setCustomId(buttonIndexer.addButton(buttons[0]))
            .setLabel(buttons[0].text)
            .setStyle('PRIMARY'),
        );
        break;
      default:
        components.push(
          new MessageSelectMenu()
            .setCustomId(buttonIndexer.addSelect())
            .setPlaceholder('Username')
            .addOptions(
              buttons.map((button) => ({
                label: button.text,
                description: button.text,
                value: button.action,
              })),
            ),
        );
        break;
    }

    rows.push(new MessageActionRow().addComponents(components));
  });

  return rows;
}

// Change bold, italic and code from HTML to Markdown
export function formatMessage(message: string): string {
  return message
    .replace(/<b>|<\/b>/g, '**')
    .replace(/<i>|<\/i>/g, '*')
    .replace(/<code>|<\/code>/g, '`');
}

export async function discordIReply(
  message: string, context: Context,
): Promise<void> {
  const { interaction, photoUrl, options } = context;

  // Compose message options for Discord
  const messageOptions: MessageOptions = {
    content: message,
    files: photoUrl ? [photoUrl] : undefined,
    components: getButtonComponents(options.buttons),
  };

  // Edit message, if second message is sent
  if (interaction.replied) {
    await interaction.editReply(messageOptions);
  } else {
    await interaction.reply(messageOptions);
  }
}

export function reply(message: string, context: Context): Promise<string> {
  // Format message to Markdown style, requested by Discord
  const formattedMessage: string = formatMessage(message);

  // Send message back to channel
  return new Promise((resolve) => {
    discordIReply(formattedMessage, context);
    resolve(formattedMessage);
  });
}

export function getKeyBasedParsedArguments(
  context: Context, requestedArgs: Argument[],
): ArgumentManager {
  const argumentManager = new ArgumentManager();
  const { discordProvidedArguments: providedArguments } = context;

  requestedArgs?.forEach((argument: Argument) => {
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
