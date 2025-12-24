import express from 'express';
import { createApiRouter } from './routes/index.js';
import { errorMiddleware  } from './middlewares/error.middleware.js';

export function createApp(deps) {
  const app = express();

  app.use(express.json());

  const apiRouter = createApiRouter(deps);
  app.use('/api', apiRouter);

  app.use(errorMiddleware);

  return app;
}