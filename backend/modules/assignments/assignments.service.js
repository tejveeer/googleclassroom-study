import { repository } from "./assignments.data-access"

export function createAssignmentsService(pool) {
  return {
    async listAssignments(courseId) {
      const { rows } = await pool.query(repository.LIST_ASSIGNMENTS, [courseId]);
      return { success: true, data: rows }
    },
    async createAssignment(courseId, creatorMemberId, topic, assignmentName, instructions, totalMarks) {
      const { rows, rowCount } = await pool.query(repository.CREATE_ASSIGNMENT, [
        courseId, 
        creatorMemberId,
        topic,
        assignmentName,
        instructions,
        totalMarks
      ]);

      if (rowCount === 0) {
        return { success: false, reason: "CREATION_FAILED" };
      }
      return { success: true, data: rows[0] };
    },
    async deleteAssignment(assignmentId) {
      const { rows, rowCount } = await pool.query(repository.DELETE_ASSIGNMENT, [assignmentId]);

      if (rowCount === 0) {
        return { success: false, reason: "DELETION_FAILED" };
      }
      return { success: true, data: rows[0] };
    },

    async listTopics(courseId) {
      const { rows } = await pool.query(repository.LIST_TOPICS, [courseId]);
      return { success: true, data: rows }
    },
    async createTopic(courseId, topic) {
      const { rows, rowCount } = await pool.query(repository.CREATE_TOPIC, [courseId, topic]);

      if (rowCount === 0) {
        return { success: false, reason: "CREATION_FAILED" };
      }
      return { success: true, data: rows[0] };
    },
    async deleteTopic(courseId, topic) {
      const { rows, rowCount } = await pool.query(repository.DELETE_TOPIC, [courseId, topic]);

      if (rowCount === 0) {
        return { success: false, reason: "DELETION_FAILED" };
      }
      return { success: true, data: rows[0] };
    }
  }
}
