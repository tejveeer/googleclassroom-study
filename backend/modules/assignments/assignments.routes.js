import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";

export function createAssignmentsRouter({ assignmentsController }) {
  const router = Router();

  router.get('/assignments/:courseId', asyncHandler(assignmentsController.list));
  router.post('/assignments/:courseId', asyncHandler(assignmentsController.create));
  router.delete('/assignments', asyncHandler(assignmentsController.delete));

  router.get('/assignments/topics/:courseId', asyncHandler(assignmentsController.listTopics));
  router.post('/assignments/topics/:courseId', asyncHandler(assignmentsController.createTopic));
  router.delete('/assignments/topics/:courseId', asyncHandler(assignmentsController.deleteTopic));
}
