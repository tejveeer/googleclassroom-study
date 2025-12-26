import { Router } from 'express';

export function createApiRouter({ authRouter, coursesRouter, postsRouter, assignmentsRouter }) {
  const router = Router();

  // Example route using dependencies
  router.get('/status', (_, res) => {
    res.json({ status: 'ok' });
  });

  router.use('/auth', authRouter);
  router.use('/courses', coursesRouter);
  router.use('/posts', postsRouter);
  router.use('/assignments', assignmentsRouter);

  return router;
}