import { ChannelCache } from '../../cache/channel';
import { ChannelData, ChannelKey } from '../../cache/models';
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
  const channelData: ChannelData = {
    id: Math.floor(Math.random() * 10000),
    key: generateChannelKey(),
    userLimit: Math.floor(Math.random() * 10000),
  };

  // Create Channel in Database
  await Cache.database.addChannel(channelData);

  return new ChannelCache(channelData);
}
