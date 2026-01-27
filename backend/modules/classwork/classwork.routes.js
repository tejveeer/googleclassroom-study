import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireCourseMember, requireStudent, requireTeacher } from "../../middlewares/auth.middleware.js";

export function createClassworkRouter({ classworkController, pool }) {
  const router = Router();
  const requireCourseMemberMiddleware = requireCourseMember(pool);
  const requireTeacherMiddleware = requireTeacher(pool);
  const requireStudentMiddleware = requireStudent(pool);

  // ----------------------------
  // Assignments (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/assignments",
    requireCourseMemberMiddleware,
    asyncHandler(classworkController.listAssignments)
  );

  router.post(
    "/courses/:courseId/assignments",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.createAssignment)
  );

  router.delete(
    "/courses/:courseId/assignments/:assignmentId",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.deleteAssignment)
  );

  // ----------------------------
  // Topics (course-scoped)
  // ----------------------------
  router.get(
    "/courses/:courseId/topics",
    requireCourseMemberMiddleware,
    asyncHandler(classworkController.listTopics)
  );

  router.post(
    "/courses/:courseId/topics",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.createTopic)
  );

  router.delete(
    "/courses/:courseId/topic/",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.deleteTopic)
  );

  // ----------------------------
  // Grades
  // ----------------------------
  router.get(
    "/:courseId/assignments/grades",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.listAllAssignmentGrades)
  );

  router.get(
    "/assignments/:assignmentId/grades",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.listAssignmentGrades)
  );

  // ----------------------------
  // Assignment settings / status
  // ----------------------------
  router.get(
    "/assignments/:assignmentId/submissions-status",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.getAssignmentSubmissionStatus)
  );

  router.patch(
    "/assignments/:assignmentId/submissions-status",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.updateAssignmentSubmissionStatus)
  );

  // ----------------------------
  // Submissions
  // ----------------------------
  router.post(
    "/assignments/:assignmentId/submissions",
    requireCourseMemberMiddleware,
    requireStudentMiddleware,
    asyncHandler(classworkController.createStudentSubmission)
  );

  router.patch(
    "/submissions/:submissionId/mark",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.updateStudentSubmissionMark)
  );

  router.patch(
    "/submissions/:submissionId/submission-status",
    requireCourseMemberMiddleware,
    requireTeacherMiddleware,
    asyncHandler(classworkController.updateStudentSubmissionStatus)
  )

  return router;
}
