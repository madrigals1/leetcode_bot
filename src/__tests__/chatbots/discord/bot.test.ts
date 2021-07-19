import * as DiscordBot from 'discord.js';
import { jest } from '@jest/globals';

import createBot from '../../../chatbots/discord/bot';
import constants from '../../../utils/constants';
import dictionary from '../../../utils/dictionary';
import DiscordBotInstance from '../../../chatbots/discord';

const te = constants.DISCORD.TEST_ENABLE;
const { teo } = process.env;

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

test(`chatbots.discord.bot.createBot function (${typeof te}, ${te}) (${typeof teo}, ${teo})`, async () => {
  if (!constants.DISCORD.TEST_ENABLE) return;

  expect(typeof createBot).toBe('function');

  // Create a test bot with test token
  const bot: DiscordBot.Client = (
    await createBot(constants.DISCORD.TEST_TOKEN)
  );

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

if (constants.DISCORD.TEST_ENABLE === true) {
  test('>>> will run only if DISCORD.TEST_ENABLE', async () => {
    expect(1).toEqual(1);
  });
}
