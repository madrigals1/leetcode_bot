import { ChannelKey } from '../../cache/models';
import { authAxios } from '../axios/authAxios';
import { LBBChannel } from '../models';
import { ChatbotProvider } from '../../chatbots';

import { convertResponseBody, convertResponseError } from './utils';

type M = LBBChannel;
const model = '/channels';

const providerMap = new Map<ChatbotProvider, string>();
providerMap.set(ChatbotProvider.Telegram, '01_telegram');
providerMap.set(ChatbotProvider.Discord, '02_discord');
providerMap.set(ChatbotProvider.Slack, '03_slack');
providerMap.set(ChatbotProvider.Mockbot, '04_mockbot');
providerMap.set(ChatbotProvider.Random, '05_random');

class Requests {
  static async get(url: string) {
    return authAxios
      .get<M>(url)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async post(url: string, body: unknown) {
    return authAxios
      .post<M>(url, body)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async delete(url: string) {
    return authAxios
      .delete<M>(url)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }

  static async patch(url: string, body: unknown) {
    return authAxios
      .patch<M>(url, body)
      .then(convertResponseBody)
      .catch(convertResponseError);
  }
}

export class ChannelService {
  static create(book: M): Promise<M> {
    return Requests.post(`${model}/`, book);
  }

  static get(id: number): Promise<M> {
    return Requests.get(`${model}/${id}/`);
  }

  static fetch(): Promise<M[]> {
    return Requests.get(`${model}/`);
  }

  static update(id: number, book: M): Promise<M> {
    return Requests.patch(`${model}/${id}/`, book);
  }

  static delete(id: number): Promise<M> {
    return Requests.delete(`${model}/${id}/`);
  }

  static findChannelByKey(channelKey: ChannelKey): Promise<M> {
    const backendProviderKey = providerMap.get(channelKey.provider);

    return Requests.post(`${model}/find-channel/`, {
      chat_id: channelKey.chatId,
      provider: backendProviderKey,
    });
  }
}
