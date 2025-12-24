import { Router } from 'express';

export function createApiRouter(deps) {
  const router = Router();

  // Example route using dependencies
  router.get('/status', (_, res) => {
    res.json({ status: 'ok' });
  });

  // Additional routes can be added here using deps

  return router;
}