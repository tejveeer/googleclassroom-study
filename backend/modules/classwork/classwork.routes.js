import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { requireCourseMember, requireStudent, requireTeacher } from "../../middleware/auth.middleware.js";

export function createClassworkRouter({ classworkController }) {
  const router = Router();

  // ----------------------------
  // Assignments (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/assignments",
    requireCourseMember,
    asyncHandler(classworkController.listAssignments)
  );

  router.post(
    "/courses/:courseId/assignments",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.createAssignment)
  );

  router.delete(
    "/courses/:courseId/assignments/:assignmentId",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.deleteAssignment)
  );

  // ----------------------------
  // Topics (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/topics",
    requireCourseMember,
    asyncHandler(classworkController.listTopics)
  );

  router.post(
    "/courses/:courseId/topics",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.createTopic)
  );

  router.delete(
    "/courses/:courseId/topics/",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.deleteTopic)
  );

  // ----------------------------
  // Grades
  // ----------------------------
  router.get(
    "/:courseId/assignments/grades",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.listAllAssignmentGrades)
  );

  router.get(
    "/assignments/:assignmentId/grades",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.listAssignmentGrades)
  );

  // ----------------------------
  // Assignment settings / status
  // ----------------------------
  router.get(
    "/assignments/:assignmentId/submissions-status",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.getAssignmentSubmissionStatus)
  );

  router.patch(
    "/assignments/:assignmentId/submissions-status",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.updateAssignmentSubmissionStatus)
  );

  // ----------------------------
  // Submissions
  // ----------------------------
  router.post(
    "/assignments/:assignmentId/submissions",
    requireCourseMember,
    requireStudent,
    asyncHandler(classworkController.createStudentSubmission)
  );

  router.patch(
    "/submissions/:submissionId/mark",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.updateStudentSubmissionMark)
  );

  router.patch(
    "/submissions/:submissionId/submission-status",
    requireCourseMember,
    requireTeacher,
    asyncHandler(classworkController.updateStudentSubmissionStatus)
  )

  return router;
}
