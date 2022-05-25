import {
  MessageActionRow,
  MessageButton,
  MessageOptions,
  MessageSelectMenu,
} from 'discord.js';

import { ArgumentsError, InputError } from '../../utils/errors';
import ArgumentManager from '../argumentManager';
import { Argument, ParsedArgument } from '../decorators/models';
import { Context, ButtonContainer, ButtonContainerType } from '../models';
import { log } from '../../utils/helper';
import { ArgumentMessages } from '../../globals/messages';

import buttonIndexer from './buttonIndexer';

export function getButtonComponents(
  buttonContainers: ButtonContainer[],
): MessageActionRow[] {
  const rows: MessageActionRow[] = [];

  buttonContainers?.forEach((buttonContainer) => {
    const { buttons, placeholder, type } = buttonContainer;

    const components = [];

    switch (type) {
      case ButtonContainerType.SingleButton:
        components.push(
          new MessageButton()
            .setCustomId(buttonIndexer.addButton(buttons[0]))
            .setLabel(buttons[0].text)
            .setStyle('PRIMARY'),
        );
        break;
      case ButtonContainerType.MultipleButtons:
        components.push(
          new MessageSelectMenu()
            .setCustomId(buttonIndexer.addSelect())
            .setPlaceholder(placeholder)
            .addOptions(
              buttons.map((button) => ({
                label: button.text,
                description: button.text,
                value: button.action,
              })),
            ),
        );
        break;
      case ButtonContainerType.CloseButton:
        // We don't show Close button in Discord
        break;
      default: break;
    }

    if (components.length !== 0) {
      rows.push(new MessageActionRow().addComponents(components));
    }
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

  // Get Discord components from provided buttons
  const components = getButtonComponents(options.buttons);

  // Compose message options for Discord
  const messageOptions: MessageOptions = {
    content: message,
    files: photoUrl ? [photoUrl] : undefined,
    components,
  };

  // Send message
  await interaction.followUp(messageOptions).catch((err) => log(err));
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
        const reason = ArgumentMessages
          .requiredArgXWasNotProvided(argument.key);
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
            throw new ArgumentsError(
              ArgumentMessages.invalidArgTypeProvidedFromDiscord(value),
            );
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
