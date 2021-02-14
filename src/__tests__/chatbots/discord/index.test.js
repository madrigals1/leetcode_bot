import constants from '../../../utils/constants';
import dictionary from '../../../utils/dictionary';
import DiscordBotInstance from '../../../chatbots/discord';

DiscordBotInstance.token = constants.DISCORD.TEST_TOKEN;

test('discord.index.run function', async () => {
  expect(DiscordBotInstance.token).toBe(constants.DISCORD.TEST_TOKEN);

  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.DISCORD_BOT_IS_RUNNING,
  );
});
