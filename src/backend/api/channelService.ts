import { ChannelKey } from '../../cache/models';
import { LBBChannel, LBBChannelKey } from '../models';
import { ChatbotProvider } from '../../chatbots';

import { Service, Requests } from './requests';

class ChannelService extends Service<LBBChannel> {
  providerMap = new Map<ChatbotProvider, string>();

  constructor() {
    super('/channels');
    this.providerMap.set(ChatbotProvider.Telegram, '01_telegram');
    this.providerMap.set(ChatbotProvider.Discord, '02_discord');
    this.providerMap.set(ChatbotProvider.Slack, '03_slack');
    this.providerMap.set(ChatbotProvider.Mockbot, '04_mockbot');
    this.providerMap.set(ChatbotProvider.Random, '05_random');
  }

  findChannelByKey(channelKey: ChannelKey): Promise<LBBChannel> {
    const backendProviderKey = this.providerMap.get(channelKey.provider);

    return Requests.post(`${this.url}/find-channel/`, {
      chat_id: channelKey.chatId,
      provider: backendProviderKey,
    });
  }

  async fetchOnlyKeys(): Promise<LBBChannelKey[]> {
    return Requests.get(`${this.url}/only-keys/`);
  }

  async refresh(id: number): Promise<boolean> {
    return Requests
      .get(`${this.url}/${id}/refresh/`)
      .then(() => true)
      .catch(() => false);
  }

  async clear(id: number): Promise<boolean> {
    return Requests
      .get(`${this.url}/${id}/clear/`)
      .then(() => true)
      .catch(() => false);
  }
}

export default new ChannelService();
