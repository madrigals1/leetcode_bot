import {
  Request, Protocol, Response, Service,
} from 'restana';
import { register } from 'prom-client';

type rq = Request<Protocol>
type rs = Response<Protocol>

export function addRoutes(app: Service<Protocol.HTTP>): void {
  // Default route
  app.get('/', async (req: rq, res: rs) => {
    res.send('LeetCode BOT - REST API');
  });

  // Grafana metrics
  app.get('/metrics', async (req: rq, res: rs) => {
    try {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (err) {
      res.send(err, 500);
    }
  });
}
