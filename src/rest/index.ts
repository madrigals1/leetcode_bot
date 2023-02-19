import * as restana from 'restana';

import { constants } from '../global/constants';
import { log } from '../utils/helper';

import { addRoutes } from './routes';

export function startRest(): void {
  // Start REST API
  const app = restana();

  addRoutes(app);

  const port = Number(constants.PORT);

  app.start(port).then(() => log(`REST API is running on port ${port}`));
}
