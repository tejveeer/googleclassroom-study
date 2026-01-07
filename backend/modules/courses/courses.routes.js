import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";

export function createCoursesRouter({ coursesController }) {
  const router = Router();

  router.get('/', asyncHandler(coursesController.list));
  router.post('/create', asyncHandler(coursesController.create));
  router.post('/join', asyncHandler(coursesController.join));

  // require course owner middleware
  router.delete('/:id', asyncHandler(coursesController.delete));

  return router;
}