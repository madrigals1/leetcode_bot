import * as DiscordBot from 'discord.js';

import createBot from '../../../chatbots/discord/bot';
import { constants } from '../../../global/constants';
import DiscordBotInstance from '../../../chatbots/discord';
import { ProviderMessages } from '../../../globals/messages';

test('chatbots.discord.bot.createBot function', async () => {
  expect(typeof createBot).toBe('function');

  // Create a test bot with test token
  const bot: DiscordBot.Client = (
    await createBot(constants.PROVIDERS.DISCORD.TOKEN!)
  );

  expect(bot instanceof DiscordBot.Client).toBe(true);

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith('>>> Discord BOT is connected!');

  await DiscordBotInstance.run();

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith('>>> Discord BOT is running!');
});
