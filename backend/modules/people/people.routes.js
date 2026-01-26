import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireCourseMember, requireTeacher } from "../../middlewares/auth.middleware.js";

export function createPeopleRouter({ peopleController, pool }) {
  const router = Router();
  const requireCourseMemberFn = requireCourseMember(pool);
  const requireTeacherFn = requireTeacher(pool);

  router.get(
    '/teachers/:courseId',
    requireCourseMemberFn,
    asyncHandler(peopleController.listTeachers)
  );
  router.get(
    '/students/:courseId',
    requireCourseMemberFn,
    asyncHandler(peopleController.listStudents)
  );
  router.delete(
    '/delete/:courseId/:memberId',
    requireCourseMemberFn,
    requireTeacherFn,
    asyncHandler(peopleController.deleteCourseMember)
  );

  return router;
}
