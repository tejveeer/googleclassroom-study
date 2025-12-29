// tests/courses.service.int.test.js
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createCoursesService } from "../modules/courses/courses.service.js"; // adjust path
import { repository } from "../modules/courses/courses.data-access.js";
import { startTestDb, stopTestDb } from "./test-db.js";

function isValidJoinCode(code) {
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/.test(code);
}

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

describe("courses.service (integration)", () => {
  let container;
  let pool;
  let coursesService;

  let creatorUser; // creates seeded courses, and creates course in createCourse tests
  let otherUser;   // non-creator for forbidden delete, etc.

  /** @type {{id:number, join_id:string}[]} */
  let seededCourses = [];
  let createdCourse = null;

  beforeAll(async () => {
    ({ container, pool } = await startTestDb());
    coursesService = createCoursesService({ pool });

    // Create a few fixed users (no faker)
    creatorUser = await createUser(pool, {
      email: "creator@example.com",
      name: "Course Creator",
    });

    otherUser = await createUser(pool, {
      email: "other@example.com",
      name: "Other User",
    });

    // Seed: 5 courses created by creatorUser, and creatorUser joins them as teacher
    for (let i = 0; i < 5; i++) {
      const courseName = `Seeded Course ${i + 1}`;
      const courseRoom = `Room ${i + 1}`;
      const joinId = `A${String(i).padStart(4, "2")}`.slice(0, 5);
      const bannerColor = "#3366ff";

      const { rows } = await pool.query(repository.CREATE_COURSE, [
        creatorUser.id,
        courseName,
        courseRoom,
        joinId,
        bannerColor,
      ]);

      const course = rows[0];
      seededCourses.push({ id: course.id, join_id: course.join_id });

      await pool.query(repository.JOIN_COURSE, [
        creatorUser.id,
        course.id,
        "teacher",
      ]);
    }
  }, 30_000);

  afterAll(async () => {
    await stopTestDb(container, pool);
  }, 30_000);

  describe("listCourses", () => {
    it("returns courses the user is a current member of", async () => {
      const result = await coursesService.listCourses(creatorUser.id);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(5);

      // minimal shape assertion
      expect(result.data[0]).toMatchObject({
        id: expect.any(Number),
        course_name: expect.any(String),
        course_room: expect.any(String),
        join_id: expect.any(String),
        banner_color: expect.any(String),
        member_id: expect.any(Number),
        user_role: expect.any(String),
        joined_at: expect.any(Date),
      });
    });

    it("returns an empty list for a user with no memberships", async () => {
      const nonExistentUserId = 999999999;
      const result = await coursesService.listCourses(nonExistentUserId);

      expect(result).toEqual({ success: true, data: [] });
    });
  });

  describe("createCourse", () => {
    it("creates a course and returns its persisted fields", async () => {
      const courseName = "New Course";
      const courseRoom = "BA 123";
      const bannerColor = "#ff33aa";

      const result = await coursesService.createCourse(
        creatorUser.id,
        courseName,
        courseRoom,
        bannerColor
      );

      expect(result.success).toBe(true);

      expect(result.data).toMatchObject({
        id: expect.any(Number),
        creator_id: creatorUser.id,
        course_name: courseName,
        course_room: courseRoom,
        banner_color: bannerColor,
        join_id: expect.any(String),
        created_at: expect.any(Date),
      });

      expect(isValidJoinCode(result.data.join_id)).toBe(true);

      createdCourse = result.data;
    });

    it("adds the creator as a teacher member of the course", async () => {
      expect(createdCourse).toBeTruthy();

      const { rows } = await pool.query(
        `
        SELECT role
        FROM classroom.course_members
        WHERE user_id = $1 AND course_id = $2
        `,
        [creatorUser.id, createdCourse.id]
      );

      expect(rows).toHaveLength(1);
      expect(rows[0].role).toBe("teacher");
    });
  });

  describe("joinCourse", () => {
    it("returns NOT_FOUND when join code does not match a course", async () => {
      const missingJoinId = "ZZZZZ"; // valid format, but not in DB

      const result = await coursesService.joinCourse(
        otherUser.id,
        missingJoinId,
        "student"
      );

      expect(result).toEqual({ success: false, reason: "NOT_FOUND" });
    });

    it("adds the user to the course when join code exists", async () => {
      const { join_id } = seededCourses[0];

      const result = await coursesService.joinCourse(
        otherUser.id,
        join_id,
        "student"
      );

      expect(result).toEqual({ success: true });

      // verify membership exists (no left_at assertion)
      const { rows } = await pool.query(
        `
        SELECT cm.role
        FROM classroom.course_members cm
        JOIN classroom.courses c ON c.id = cm.course_id
        WHERE cm.user_id = $1 AND c.join_id = $2
        `,
        [otherUser.id, join_id]
      );

      expect(rows).toHaveLength(1);
      expect(rows[0].role).toBe("student");
    });
  });

  describe("deleteCourse", () => {
    it("returns NOT_FOUND when the course does not exist", async () => {
      const result = await coursesService.deleteCourse(otherUser.id, 999999999);
      expect(result).toEqual({ success: false, reason: "NOT_FOUND" });
    });

    it("returns FORBIDDEN when a non-creator attempts to delete an existing course", async () => {
      const existingCourseId = seededCourses[1].id;

      const result = await coursesService.deleteCourse(otherUser.id, existingCourseId);
      expect(result).toEqual({ success: false, reason: "FORBIDDEN" });
    });

    it("deletes the course when requested by the creator", async () => {
      expect(createdCourse).toBeTruthy();

      const result = await coursesService.deleteCourse(creatorUser.id, createdCourse.id);
      expect(result).toEqual({ success: true });

      const check = await pool.query(
        `SELECT 1 FROM classroom.courses WHERE id = $1`,
        [createdCourse.id]
      );
      expect(check.rowCount).toBe(0);
    });
  });
});
