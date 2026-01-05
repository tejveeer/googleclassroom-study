import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { requireCourseMember } from "../../middleware/auth.middleware";

export function createPeopleRouter({ peopleService }) {
  const router = Router();

  router.get(
    '/teachers/:courseId',
    requireCourseMember,
    asyncHandler(peopleService.listTeachers)
  );
  router.get(
    '/students/:courseId',
    requireCourseMember,
    asyncHandler(peopleService.listStudents)
  );
  router.delete(
    '/delete/:courseId',
    requireCourseMember,
    asyncHandler(peopleService.deleteCourseMember)
  );

  return router;
}