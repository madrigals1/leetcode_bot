import * as client from 'prom-client';

const histogram = new client.Histogram({
  name: 'leetcode_bot:action_time',
  help: 'Duration of each action in ms',
  labelNames: ['action', 'error', 'provider'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

export {
  histogram,
};
