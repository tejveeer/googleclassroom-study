import { createPool } from '../config/db.js';

import { createClassworkController } from '../modules/classwork/classwork.controller.js';
import { createClassworkService } from '../modules/classwork/classwork.service.js';
import { createClassworkRouter } from '../modules/classwork/classwork.routes.js';

import { createCoursesController } from '../modules/courses/courses.controller.js';
import { createCoursesRouter } from '../modules/courses/courses.routes.js';
import { createCoursesService } from '../modules/courses/courses.service.js';

import { createPeopleController } from '../modules/people/people.controller.js';
import { createPeopleRouter } from '../modules/people/people.routes.js';
import { createPeopleService } from '../modules/people/people.service.js';

import { createPostsController } from '../modules/posts/posts.controller.js';
import { createPostsRouter } from '../modules/posts/posts.routes.js';
import { createPostsService } from '../modules/posts/posts.service.js';

import { createAuthController } from '../modules/auth/auth.controller.js';
import { createAuthRouter } from '../modules/auth/auth.routes.js';

export function createDependencies() {
  const pool = createPool();

  const authController = createAuthController({ pool });
  const authRouter = createAuthRouter({ authController });

  const coursesService = createCoursesService({ pool });
  const coursesController = createCoursesController({ coursesService });
  const coursesRouter = createCoursesRouter({ coursesController });

  const classworkService = createClassworkService({ pool });
  const classworkController = createClassworkController({ classworkService });
  const classworkRouter = createClassworkRouter({ classworkController });

  const peopleService = createPeopleService({ pool });
  const peopleController = createPeopleController({ peopleService });
  const peopleRouter = createPeopleRouter({ peopleController });

  const postsService = createPostsService({ pool });
  const postsController = createPostsController({ postsService });
  const postsRouter = createPostsRouter({ postsController, pool });

  return {
    pool,

    coursesService,
    coursesController,
    coursesRouter,

    classworkService,
    classworkController,
    classworkRouter,

    peopleService,
    peopleController,
    peopleRouter,

    postsService,
    postsController,
    postsRouter,

    authController,
    authRouter
  };
}