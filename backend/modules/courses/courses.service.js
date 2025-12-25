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
    async listCourses({ userId }) {
      const { rows } = await pool.query(repository.GET_USER_COURSES, [userId]);
      return rows;
    },

    async createCourse({ userId, courseName, courseRoom, bannerColor }) {
      const joinId = generateJoinCode();
      const { rows } = await pool.query(repository.CREATE_COURSE, [
        userId,
        courseName,
        courseRoom,
        joinId,
        bannerColor,
      ]);
      return rows[0];
    },

    async joinCourse({ userId, joinId, role }) {
      const { rows } = await pool.query(repository.GET_COURSEID_FROM_JOINID, [joinId]);
      if (rows.length === 0) return false;

      const courseId = rows[0].id;
      const res2 = await pool.query(repository.JOIN_COURSE, [userId, courseId, role]);
      return res2.rowCount > 0;
    },

    async deleteCourse({ userId, courseId }) {
      const { rowCount } = await pool.query(repository.DELETE_COURSE, [userId, courseId]);
      return rowCount > 0;
    },
  };
}
