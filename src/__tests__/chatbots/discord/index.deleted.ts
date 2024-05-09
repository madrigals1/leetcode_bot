import { jest } from '@jest/globals';

import DiscordBotInstance from '../../../chatbots/discord';

jest.setTimeout(30000);

afterAll(async () => {
  jest.setTimeout(5000);
});

test('chatbots.discord.index.run function', async () => {
  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith('>>> Discord BOT is running!');
});
