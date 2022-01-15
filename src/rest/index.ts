import * as restana from 'restana';
import { collectDefaultMetrics } from 'prom-client';

import constants from '../utils/constants';
import { log } from '../utils/helper';

import { addRoutes } from './routes';

export function startRest(): void {
  // Start collecting metrics
  collectDefaultMetrics();

  // Start REST API
  const app = restana();

  addRoutes(app);

  const port = Number(constants.PORT);

  app.start(port).then(() => log(`REST API is running on port ${port}`));
}
