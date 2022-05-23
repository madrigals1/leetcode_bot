import { LBBUser } from '../models';

import { Requests, Service } from './requests';

class UserService extends Service<LBBUser> {
  constructor() {
    super('/users');
  }

  async getCount(channelId: number): Promise<number> {
    return Requests.post(`${this.url}/count/`, { channel_id: channelId });
  }
}

export default new UserService();
