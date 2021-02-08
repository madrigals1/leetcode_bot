import DiscordBot from 'discord.js';
import { jest } from '@jest/globals';

import createBot from '../chatbots/discord/bot';
import constants from '../utils/constants';
import dictionary from '../utils/dictionary';
import DiscordBotInstance from '../chatbots/discord';
import { reply, formatMessage } from '../chatbots/discord/utils';

DiscordBotInstance.token = constants.DISCORD.TEST_TOKEN;

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

test('discord.bot.createBot function', async () => {
  expect(typeof createBot).toBe('function');

  // Create a test bot with test token
  const bot = await createBot(constants.DISCORD.TEST_TOKEN);

  expect(bot instanceof DiscordBot.Client).toBe(true);

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_CONNECTED,
  );

  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING,
  );
});

test('discord.index.run function', async () => {
  expect(DiscordBotInstance.token).toBe(constants.DISCORD.TEST_TOKEN);

  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING,
  );
});

test('discord.utils.formatMessage function', async () => {
  const testCases = [
    ['<b>Bold Text</b>', '**Bold Text**'],
    ['<i>Italic Text</i>', '*Italic Text*'],
    ['<code>Code Text</code>', '`Code Text`'],
    [
      'Hello <b><i><code>Human</code></i></b>, how <code>was <b>your <i>day</'
      + 'i></b></code>',
      'Hello ***`Human`***, how `was **your *day***`',
    ],
  ];

  testCases.forEach(([input, output]) => {
    expect(formatMessage(input)).toBe(output);
  });
});
