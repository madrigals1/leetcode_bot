import { ChannelCache } from '../../cache/channel';
import { Channel, ChannelKey } from '../../cache/models';
import { ChatbotProvider } from '../../chatbots';
import Cache from '../../cache';

import { randomString } from './randomUtils.test';

export function generateChannelKey(): ChannelKey {
  return {
    chatId: randomString(10),
    provider: ChatbotProvider.Telegram,
  };
}

export async function generateChannelCache(): Promise<ChannelCache> {
  // Generate values
  const channel: Channel = {
    id: Math.floor(Math.random() * 10000),
    key: generateChannelKey(),
  };

  // Create Channel in Database
  await Cache.database.addChannel(channel);

  return new ChannelCache(channel);
}
