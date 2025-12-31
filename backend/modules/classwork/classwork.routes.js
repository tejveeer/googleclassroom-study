import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";

export function createClassworkRouter({ classworkController }) {
  const router = Router();

  // ----------------------------
  // Assignments (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/assignments",
    asyncHandler(classworkController.listAssignments)
  );

  router.post(
    "/courses/:courseId/assignments",
    asyncHandler(classworkController.createAssignment)
  );

  router.delete(
    "/courses/:courseId/assignments/:assignmentId",
    asyncHandler(classworkController.deleteAssignment)
  );

  // ----------------------------
  // Topics (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/topics",
    asyncHandler(classworkController.listTopics)
  );

  router.post(
    "/courses/:courseId/topics",
    asyncHandler(classworkController.createTopic)
  );

  router.delete(
    "/courses/:courseId/topics/",
    asyncHandler(classworkController.deleteTopic)
  );

  // ----------------------------
  // Grades
  // ----------------------------
  router.get(
    "/:courseId/assignments/grades",
    asyncHandler(classworkController.listAllAssignmentGrades)
  );

  router.get(
    "/assignments/:assignmentId/grades",
    asyncHandler(classworkController.listAssignmentGrades)
  );

  // ----------------------------
  // Assignment settings / status
  // ----------------------------
  router.get(
    "/assignments/:assignmentId/submissions-status",
    asyncHandler(classworkController.getAssignmentSubmissionStatus)
  );

  router.patch(
    "/assignments/:assignmentId/submissions-status",
    asyncHandler(classworkController.updateAssignmentSubmissionStatus)
  );

  // ----------------------------
  // Submissions
  // ----------------------------
  router.post(
    "/assignments/:assignmentId/submissions",
    asyncHandler(classworkController.createStudentSubmission)
  );

  router.patch(
    "/submissions/:submissionId/mark",
    asyncHandler(classworkController.updateStudentSubmissionMark)
  );

  router.patch(
    "/submissions/:submissionId/submission-status",
    asyncHandler(classworkController.updateStudentSubmissionStatus)
  )

  return router;
}
