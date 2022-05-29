import * as _ from 'lodash';
import nock from 'nock';

import { users } from '../data.mock';
import { LBBUser } from '../../../backend/models';

export function addUserRequests(nockInstance: nock.Scope): void {
  // GET /api/v1/users/
  nockInstance
    .get('/api/v1/users/')
    .reply(200, {
      count: 2,
      next: null,
      previous: null,
      results: users,
    });

  // POST /api/v1/users/
  nockInstance
    .post('/users/', (body: LBBUser) => {
      users.push(body);
      return !!body;
    })
    .reply(200, (uri, requestBody: LBBUser) => ({
      ...requestBody,
      id: users.length + 1,
    }));

  // POST /api/v1/users/
  nockInstance
    .patch('/users/', (id: number, body: LBBUser) => {
      _.replace(users, { id }, body);
      return !!body;
    })
    .reply(200, (uri, requestBody: LBBUser) => ({
      ...requestBody,
      id: users.length + 1,
    }));
}
