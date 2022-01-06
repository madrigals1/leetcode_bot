import { jest } from '@jest/globals';

import dictionary from '../../../utils/dictionary';
import DiscordBotInstance from '../../../chatbots/discord';

const { SERVER_MESSAGES: SM } = dictionary;

jest.setTimeout(30000);

afterAll(async () => {
  jest.setTimeout(5000);
});

test('chatbots.discord.index.run function', async () => {
  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    SM.DISCORD_BOT_IS_RUNNING,
  );
});
