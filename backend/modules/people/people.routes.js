import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";

export function createPeopleRouter({ createPeopleService }) {
  const router = Router();
  const peopleService = createPeopleService();

  router.get('/teachers/:courseId', asyncHandler(peopleService.listTeachers));
  router.get('/students/:courseId', asyncHandler(peopleService.listStudents));
  router.delete('/delete/:courseId', asyncHandler(peopleService.deleteCourseMember));
}