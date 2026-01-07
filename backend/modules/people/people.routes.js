import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireCourseMember } from "../../middlewares/auth.middleware.js";

export function createPeopleRouter({ peopleController }) {
  const router = Router();

  router.get(
    '/teachers/:courseId',
    requireCourseMember,
    asyncHandler(peopleController.listTeachers)
  );
  router.get(
    '/students/:courseId',
    requireCourseMember,
    asyncHandler(peopleController.listStudents)
  );
  router.delete(
    '/delete/:courseId',
    requireCourseMember,
    asyncHandler(peopleController.deleteCourseMember)
  );

  return router;
}
