import express from 'express';
import { createApiRouter } from './router.js';
import { errorMiddleware  } from '../middlewares/error.middleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export function createApp(deps) {
  const app = express();

  app.use(express.json());
  app.use(cors({
    "origin": "http://localhost:5173",
    credentials: true
  }));
  app.use(cookieParser());

  const apiRouter = createApiRouter(deps);

  app.use('/api', apiRouter);
  app.use(errorMiddleware);

  return app;
}
