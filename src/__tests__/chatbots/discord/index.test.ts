import { jest } from '@jest/globals';

import constants from '../../../utils/constants';
import dictionary from '../../../utils/dictionary';
import DiscordBotInstance from '../../../chatbots/discord';

DiscordBotInstance.token = constants.DISCORD.TEST_TOKEN;

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

if (constants.DISCORD.TEST_ENABLE) {
  test('chatbots.discord.index.run function', async () => {
    await DiscordBotInstance.run();

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith(
      dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING,
    );
  });
}
