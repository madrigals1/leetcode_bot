import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  Interaction,
  SelectMenuInteraction,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { constants } from '../../utils/constants';
import { SERVER_MESSAGES as SM } from '../../utils/dictionary';
import { log, error } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import { Context, ComplexInteraction } from '../models';
import { getPositionalParsedArguments } from '../decorators/utils';
import ArgumentManager from '../argumentManager';
import { Argument } from '../decorators/models';

import createBot from './bot';
import { getKeyBasedParsedArguments, reply } from './utils';
import buttonIndexer from './buttonIndexer';

const { DISCORD } = constants.PROVIDERS;

class Discord {
  token: string = DISCORD.TOKEN;

  applicationId: string = DISCORD.APP_ID;

  guildId: string = DISCORD.GUILD_ID;

  bot: Client;

  static async executeAction(
    interaction: ComplexInteraction,
    action: string,
    argumentParser: (
      context: Context, requestedArgs: Argument[],
    ) => ArgumentManager,
  ) {
    const commandName = action.split(' ')[0].substring(1);
    const id = constants.PROVIDERS.DISCORD.ID;

    // Find appropriate action by name and execute it
    for (let i = 0; i < registeredActions.length; i++) {
      const { name, property } = registeredActions[i];
      if (name === commandName) {
        const context: Context = {
          text: action,
          reply,
          interaction,
          argumentParser,
          provider: id,
          prefix: constants.PROVIDERS.DISCORD.PREFIX,
          channelKey: {
            chatId: interaction.channelId,
            provider: id,
          },
          options: {},
        };

        if (interaction instanceof CommandInteraction) {
          context.discordProvidedArguments = interaction.options.data;
        }

        Actions[property](context);

        // Stop searching after action is found
        return;
      }
    }
  }

  static async handleCommand(interaction: CommandInteraction): Promise<void> {
    this.executeAction(
      interaction,
      `/${interaction.commandName}`,
      getKeyBasedParsedArguments,
    );
  }

  static async handleButton(interaction: ButtonInteraction): Promise<void> {
    const button = buttonIndexer.getButton(interaction.customId);
    const action = button.action.trim();

    this.executeAction(
      interaction,
      action,
      getPositionalParsedArguments,
    );
  }

  static async handleSelectMenu(
    interaction: SelectMenuInteraction,
  ): Promise<void> {
    const action = interaction.values[0].trim();

    this.executeAction(
      interaction,
      action,
      getPositionalParsedArguments,
    );
  }

  async run() {
    // Create Bot with token
    this.bot = await createBot(this.token);

    // Generate Discord commands from registered actions
    const commands = registeredActions
      .map(({ name, args }) => {
        const command = new SlashCommandBuilder()
          .setName(name)
          .setDescription(name);

        const allIndexArguments = args;

        allIndexArguments?.forEach((argument) => {
          command.addStringOption((option) => option
            .setName(argument.key)
            .setDescription(argument.name));
        });

        return command;
      })
      .map((command) => command.toJSON());

    // REST actions handler
    const rest = new REST({ version: '9' }).setToken(this.token);

    // Register commands in Guild
    rest
      .put(
        Routes.applicationGuildCommands(this.applicationId, this.guildId),
        { body: commands },
      )
      .then(() => log('Successfully registered application commands.'))
      .catch(error);

    // Handle actions
    this.bot.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isCommand()) return Discord.handleCommand(interaction);
      if (interaction.isButton()) return Discord.handleButton(interaction);
      if (interaction.isSelectMenu()) {
        return Discord.handleSelectMenu(interaction);
      }
      return null;
    });

    log(SM.DISCORD_BOT_IS_RUNNING);
  }
}

export default new Discord();
