import { createPool } from '../config/db.js';
import { createCoursesController } from '../modules/courses/courses.controller.js';
import { createCoursesRouter } from '../modules/courses/courses.routes.js';
import { createCoursesService } from '../modules/courses/courses.service.js';

export function createDependencies() {
  const pool = createPool();

  const coursesService = createCoursesService({ pool });
  const coursesController = createCoursesController({ coursesService });
  const coursesRouter = createCoursesRouter({ coursesController});

  return {
    pool,
    coursesService,
    coursesController,
    coursesRouter,
  };
}