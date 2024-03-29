import { InteractionReplyOptions } from 'discord.js';
import {
  ActionRowBuilder,
  SelectMenuBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  AnyComponentBuilder,
} from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v9';

import { ArgumentsError, InputError } from '../../global/errors';
import ArgumentManager from '../argumentManager';
import { Argument, ParsedArgument } from '../decorators/models';
import { Context, ButtonContainer, ButtonContainerType } from '../models';
import { log } from '../../utils/helper';
import { ArgumentMessages } from '../../global/messages';

import buttonIndexer from './buttonIndexer';

export function getButtonComponents(
  buttonContainers: ButtonContainer[],
): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

  buttonContainers?.forEach((buttonContainer) => {
    const { buttons, placeholder, type } = buttonContainer;

    const components: AnyComponentBuilder[] = [];

    switch (type) {
      case ButtonContainerType.SingleButton:
        components.push(
          new ButtonBuilder({
            custom_id: buttonIndexer.addButton(buttons[0]),
            label: buttons[0].text,
            style: ButtonStyle.Primary,
          }),
        );
        break;
      case ButtonContainerType.MultipleButtons:
        components.push(
          new SelectMenuBuilder({
            custom_id: buttonIndexer.addSelect(),
            placeholder,
            options: buttons.map((button) => ({
              label: button.text,
              description: button.text,
              value: button.action,
            })),
          }),
        );
        break;
      case ButtonContainerType.CloseButton:
        // We don't show Close button in Discord
        break;
      default: break;
    }

    if (components.length !== 0) {
      rows.push(new ActionRowBuilder({
        components: components.map((component) => component.toJSON()),
      }));
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
  message: string,
  context: Context,
): Promise<void> {
  const { interaction, photoUrl, options } = context;

  // Get Discord components from provided buttons
  const components = getButtonComponents(options.buttons);

  // Compose message options for Discord
  const messageOptions: InteractionReplyOptions = {
    content: message,
    files: photoUrl ? [photoUrl] : undefined,
    components,
    ephemeral: true,
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
  context: Context,
  requestedArgs: Argument[],
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
