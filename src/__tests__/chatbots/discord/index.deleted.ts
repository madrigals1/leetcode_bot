import DiscordBotInstance from '../../../chatbots/discord';
import { ProviderMessages } from '../../../globals/messages';

test('chatbots.discord.index.run function', async () => {
  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    ProviderMessages.discordBotIsRunning,
  );
});
