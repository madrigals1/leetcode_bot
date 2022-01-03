import { jest } from '@jest/globals';

import constants from '../../../utils/constants';
import dictionary from '../../../utils/dictionary';
import DiscordBotInstance from '../../../chatbots/discord';

const { SERVER_MESSAGES: SM } = dictionary;

DiscordBotInstance.token = constants.PROVIDERS.DISCORD.TEST_TOKEN;

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

test('chatbots.discord.index.run function', async () => {
  if (!constants.PROVIDERS.DISCORD.TEST_ENABLE) return;

  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    SM.DISCORD_BOT_IS_RUNNING,
  );
});
