import { KontestContest } from '../../scheduler/kontest/models';

import { Service, Requests } from './requests';

class ContestService extends Service<KontestContest> {
  constructor() {
    super('/contests');
  }

  async fetchClosest(): Promise<KontestContest[]> {
    return Requests.get(`${this.url}/closest/`);
  }
}

export default new ContestService();
