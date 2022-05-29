import * as nock from 'nock';

import { constants } from '../../../globals/constants';

import { addUserRequests } from './userService.mock';

const nockInstance = nock(constants.LBB.URL);

addUserRequests(nockInstance);
