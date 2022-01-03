import { Client, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import { log, error } from '../../utils/helper';
import Actions, { registeredActions } from '../actions';
import { Context } from '../models';

import createBot from './bot';
import { getKeyBasedParsedArguments, reply } from './utils';

const { DISCORD } = constants.PROVIDERS;
const { SERVER_MESSAGES: SM } = dictionary;

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
      if (!interaction.isCommand()) return;

      const { commandName, options } = interaction;

      // Find appropriate action by name and execute it
      for (let i = 0; i < registeredActions.length; i++) {
        const { name, property } = registeredActions[i];
        if (name === commandName) {
          const context: Context = {
            text: '',
            reply,
            discordProvidedArguments: options.data,
            interaction,
            argumentParser: getKeyBasedParsedArguments,
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

    log(SM.DISCORD_BOT_IS_RUNNING);
  }
}

export default new Discord();
