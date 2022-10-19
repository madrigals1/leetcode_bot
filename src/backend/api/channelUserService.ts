import { LBBChannelUser } from '../models';

import { Service } from './requests';

class ChannelUserService extends Service<LBBChannelUser> {
  constructor() {
    super('/channel-users');
  }
}

export default new ChannelUserService();
