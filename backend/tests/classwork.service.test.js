import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClassworkService } from "../modules/classwork/classwork.service.js";
import { repository } from "../modules/classwork/classwork.data-access.js";
import { startTestDb, stopTestDb } from "./test-db.js";

async function createUser(pool, { email, name, avatarUrl = null }) {
  const { rows } = await pool.query(
    `
    INSERT INTO classroom.users (email, name, avatar_url)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, avatar_url;
    `,
    [email, name, avatarUrl]
  );
  return rows[0];
}

async function addUserToCourse(pool, userId, courseId, role) {
  const { rows } = await pool.query(
    `
    INSERT INTO classroom.course_members (user_id, course_id, role)
    VALUES ($1, $2, $3)
    RETURNING id;
    `,
    [userId, courseId, role]
  );
  return rows[0];
}

async function createCourse(pool, creatorId, courseName) {
  const { rows } = await pool.query(
    `
    INSERT INTO classroom.courses (creator_id, course_name, course_room, join_id, banner_color)
    VALUES ($1, $2, 'Room 101', 'ABCDE', '#123456')
    RETURNING id;
    `,
    [creatorId, courseName]
  );
  return rows[0];
}

async function getCourseMemberId(pool, userId, courseId) {
  const { rows } = await pool.query(
    `
    SELECT id
    FROM classroom.course_members
    WHERE user_id = $1 AND course_id = $2
    `,
    [userId, courseId]
  );
  return rows[0]?.id;
}

describe("classwork.service (integration)", () => {
  let container;
  let pool;
  let classworkService;

  let teacher;
  let student1;
  let student2;
  let course;
  let topicId;
  let assignment1;
  let assignment2;

  let teacherMemberId;
  let student1MemberId;
  let student2MemberId;

  beforeEach(async () => {
    ({ container, pool } = await startTestDb());
    classworkService = createClassworkService(pool);

    // Setup resources
    teacher = await createUser(pool, { email: "teacher@example.com", name: "Teacher" });
    student1 = await createUser(pool, { email: "student1@example.com", name: "Student 1" });
    student2 = await createUser(pool, { email: "student2@example.com", name: "Student 2" });

    course = await createCourse(pool, teacher.id, "Test Course");

    await addUserToCourse(pool, teacher.id, course.id, "teacher");
    await addUserToCourse(pool, student1.id, course.id, "student");
    await addUserToCourse(pool, student2.id, course.id, "student");

    teacherMemberId = await getCourseMemberId(pool, teacher.id, course.id);
    student1MemberId = await getCourseMemberId(pool, student1.id, course.id);
    student2MemberId = await getCourseMemberId(pool, student2.id, course.id);

    const { rows: topicRows } = await pool.query(repository.CREATE_TOPIC, [course.id, "Test Topic"]);
    topicId = topicRows[0].id;

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const { rows: assignmentRows1 } = await pool.query(repository.CREATE_ASSIGNMENT, [
      course.id,
      teacherMemberId,
      null,
      true,
      "Assignment 1",
      "Instructions for A1",
      100,
      dueDate,
    ]);
    assignment1 = assignmentRows1[0];

    const { rows: assignmentRows2 } = await pool.query(repository.CREATE_ASSIGNMENT, [
      course.id,
      teacherMemberId,
      topicId,
      true,
      "Assignment 2",
      "Instructions for A2",
      50,
      dueDate,
    ]);
    assignment2 = assignmentRows2[0];

    await pool.query(repository.ADD_STUDENT_SUBMISSION, [assignment2.id, student1MemberId, "Submission 1"]);
    await pool.query(repository.ADD_STUDENT_SUBMISSION, [assignment2.id, student2MemberId, "Submission 2"]);

    await pool.query(repository.UPDATE_STUDENT_SUBMISSION_MARK, [assignment2.id, student1MemberId, 45, teacherMemberId]);
  });

  afterEach(async () => {
    await stopTestDb(container, pool);
  });

  describe("Assignments", () => {
    it("lists assignments for a course", async () => {
      const result = await classworkService.listAssignments(course.id);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("creates an assignment for a course", async () => {
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const result = await classworkService.createAssignment(
        course.id,
        teacherMemberId,
        null,
        "New Assignment",
        "New Instructions",
        75,
        dueDate
      );
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        assignment_name: "New Assignment",
        total_marks: 75,
      });
    });

    it("creates an assignment under a topic", async () => {
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const result = await classworkService.createAssignment(
        course.id,
        teacherMemberId,
        topicId,
        "Topic Assignment",
        "Topic Instructions",
        50,
        dueDate
      );
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        assignment_name: "Topic Assignment",
        topic_id: topicId,
      });
    });

    it("deletes an assignment", async () => {
      const result = await classworkService.deleteAssignment(assignment1.id);
      expect(result.success).toBe(true);
    });

    it("deletes an assignment under a topic", async () => {
      const result = await classworkService.deleteAssignment(assignment2.id);
      expect(result.success).toBe(true);
    });
  });

  describe("Topics", () => {
    it("lists topics for a course", async () => {
      const result = await classworkService.listTopics(course.id);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it("creates a topic for a course", async () => {
      const result = await classworkService.createTopic(course.id, "New Topic");
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({ topic: "New Topic" });
    });

    it("deletes a topic", async () => {
      const result = await classworkService.deleteTopic(course.id, topicId);
      expect(result.success).toBe(true);
    });
  });

  describe("Grades", () => {
    it("lists all assignment grades for a course", async () => {
      const result = await classworkService.listAllAssignmentGrades(course.id);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2); // Two students
    });

    it("lists grades for a specific assignment", async () => {
      const result = await classworkService.listAssignmentGrades(assignment2.id);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2); // Two submissions
    });
  });

  describe("Submissions", () => {
    it("gets assignment submission status", async () => {
      const result = await classworkService.getAssignmentSubmissionStatus(course.id, assignment2.id);
      expect(result.success).toBe(true);
      expect(result.data.accepting_submissions).toBe(true);
    });

    it("updates assignment submission status", async () => {
      const result = await classworkService.updateAssignmentSubmissionStatus(course.id, assignment2.id, false);
      expect(result.success).toBe(true);
      expect(result.data.accepting_submissions).toBe(false);
    });

    it("creates a student submission if before due date", async () => {
      const result = await classworkService.createStudentSubmission(assignment1.id, student1MemberId, "New Submission");
      expect(result.success).toBe(true);
    });

    it("does not create a student submission if after due date", async () => {
      const pastDueDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      const { rows: pastAssignmentRows } = await pool.query(repository.CREATE_ASSIGNMENT, [
        course.id,
        teacherMemberId,
        null,          // topic_id
        true,          // accepting_submissions
        "Past Due Assignment",
        "Instructions",
        100,
        pastDueDate,
      ]);

      const pastAssignmentId = pastAssignmentRows[0].id;

      const result = await classworkService.createStudentSubmission(
        pastAssignmentId,
        student1MemberId,
        "Late Submission"
      );

      expect(result.success).toBe(false);
      expect(result.reason).toBe("PAST_DUE_DATE");
    });

    it("updates a student's submission mark", async () => {
      const result = await classworkService.updateStudentSubmissionMark(assignment2.id, student2MemberId, 40, teacherMemberId);
      expect(result.success).toBe(true);
      expect(result.data.mark).toBe(40);
    });
  });
});
