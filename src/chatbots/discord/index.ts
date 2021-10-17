import { Client, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { log, error } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import { Context } from '../models';
import { getPositionalParsedArguments } from '../decorators/utils';

import createBot from './bot';
import { reply } from './utils';

const { DISCORD } = constants.PROVIDERS;

class Discord {
  token: string = DISCORD.TOKEN;

  applicationId: string = DISCORD.APP_ID;

  guildId: string = DISCORD.GUILD_ID;

  bot: Client;

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
          command
            .addStringOption((option) => option
              .setName(argument.key)
              .setDescription(argument.name));
        });

        return command;
      }).map((command) => command.toJSON());

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
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      // Find appropriate action by name and execute it
      for (let i = 0; i < registeredActions.length; i++) {
        const { name, property } = registeredActions[i];
        if (name === commandName) {
          const context: Context = {
            text: '',
            reply,
            ireply: async (message: string) => {
              await interaction.reply(message);
            },
            argumentParser: getPositionalParsedArguments,
            provider: constants.PROVIDERS.DISCORD.NAME,
            prefix: constants.PROVIDERS.DISCORD.PREFIX,
            options: {},
          };

          Actions[property](context);

          // Stop searching after action is found
          return;
        }
      }
    });

    log(dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING);
  }
}

export default new Discord();
