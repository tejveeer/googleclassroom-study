// courses.service.js
import { repository } from "./courses.data-access.js";

function generateJoinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function createCoursesService({ pool }) {
  return {
    async listCourses(userId) {
      const { rows } = await pool.query(repository.GET_USER_COURSES, [userId]);

      return {
        success: true,
        data: rows,
      };
    },

    async createCourse(userId, courseName, courseRoom, bannerColor) {
      const joinId = generateJoinCode();

      const { rows } = await pool.query(repository.CREATE_COURSE, [
        userId,
        courseName,
        courseRoom,
        joinId,
        bannerColor,
      ]);

      const courseId = rows[0].id;

      await pool.query(repository.JOIN_COURSE, [
        userId,
        courseId,
        "teacher",
      ]);

      return {
        success: true,
        data: rows[0],
      };
    },

    async joinCourse(userId, joinId, role) {
      const { rows } = await pool.query(
        repository.GET_COURSEID_FROM_JOINID,
        [joinId]
      );

      if (rows.length === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      const courseId = rows[0].id;

      const result = await pool.query(
        repository.JOIN_COURSE,
        [userId, courseId, role]
      );

      if (result.rowCount === 0) {
        return { success: false, reason: "JOIN_FAILED" };
      }

      return { success: true };
    },

    async deleteCourse(userId, courseId) {
      const { rows } = await pool.query(
        repository.GET_COURSE_CREATOR_ID,
        [courseId]
      );

      if (rows.length === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      if (rows[0].creator_id !== userId) {
        return { success: false, reason: "FORBIDDEN" };
      }

      const { rowCount } = await pool.query(
        repository.DELETE_COURSE,
        [userId, courseId]
      );

      if (rowCount === 0) {
        return { success: false, reason: "DELETE_FAILED" };
      }

      return { success: true };
    },
  };
}
