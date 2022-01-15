import {
  Request, Protocol, Response, Service,
} from 'restana';
import { register } from 'prom-client';

export function addRoutes(app: Service<Protocol.HTTP>): void {
  // Grafana metrics
  app.get('/metrics', async (
    req: Request<Protocol>, res: Response<Protocol>,
  ) => {
    try {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (err) {
      res.send(err, 500);
    }
  });
}
