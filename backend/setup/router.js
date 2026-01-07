import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';

export function createApiRouter({ authRouter, coursesRouter, postsRouter, classworkRouter, peopleRouter }) {
  const router = Router();

  // Example route using dependencies
  router.get('/status', (_, res) => {
    res.json({ status: 'ok' });
  });

  router.use('/auth', authRouter);
  router.use('/courses', requireAuth, coursesRouter);
  router.use('/posts', requireAuth, postsRouter);
  router.use('/classwork', requireAuth, classworkRouter);
  router.use('/people', requireAuth, peopleRouter);

  return router;
}
