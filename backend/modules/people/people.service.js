import { repository } from "./people.data-access"

export function createPeopleService({ pool }) {
  return {
    async listTeachers(courseId) {
      const res = await pool.query(repository.LIST_TEACHERS, [courseId]);
      return { success: true, data: res.rows };
    },
    async listStudents(courseId) {
      const res = await pool.query(repository.LIST_STUDENTS, [courseId]);
      return { success: true, data: res.rows };
    },
    async deleteCourseMember(courseId, memberId) {
      const res = await pool.query(repository.DELETE_COURSE_MEMBER, [memberId, courseId]);
      if (res.rowCount === 0) {
        return { success: false, reason: "NON_EXISTENT_USER" };
      }

      return { sucess: true, data: res.rows[0] };
    }
  }
}