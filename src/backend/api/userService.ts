import { LBBUser, LBBUserOnlyUsername } from '../models';

import { Requests, Service } from './requests';

class UserService extends Service<LBBUser> {
  constructor() {
    super('/users');
  }

  async getCount(channelId: number): Promise<number> {
    return Requests.post(`${this.url}/count/`, { channel_id: channelId });
  }

  async fetchOnlyUsernames(): Promise<LBBUserOnlyUsername[]> {
    return Requests.get(`${this.url}/username-only/`);
  }
}

export default new UserService();
