import { repository } from "./classwork.data-access.js";

export function createClassworkService({ pool }) {
  const assignments = createAssignmentsService(pool);
  const topics = createTopicsService(pool);
  const grades = createGradesService(pool);
  const submissions = createSubmissionsService(pool);

  return {
    ...assignments,
    ...topics,
    ...grades,
    ...submissions,
  };
}

/* ---------------------------------------------
 * Assignments
 * --------------------------------------------- */
function createAssignmentsService(pool) {
  return {
    async listAssignments(courseId) {
      const { rows } = await pool.query(repository.LIST_ASSIGNMENTS, [courseId]);
      return { success: true, data: rows };
    },

    async createAssignment(
      courseId,
      creatorMemberId,
      topicId,
      assignmentName,
      instructions,
      totalMarks,
      dueDate
    ) {
      const isAcceptingSubmissions = true;

      const { rows, rowCount } = await pool.query(repository.CREATE_ASSIGNMENT, [
        courseId,
        creatorMemberId,
        topicId,
        isAcceptingSubmissions,
        assignmentName,
        instructions,
        totalMarks,
        dueDate
      ]);

      if (rowCount === 0) {
        return { success: false, reason: "CREATION_FAILED" };
      }

      return { success: true, data: rows[0] };
    },

    async deleteAssignment(assignmentId) {
      const { rows, rowCount } = await pool.query(
        repository.DELETE_ASSIGNMENT,
        [assignmentId]
      );

      if (rowCount === 0) {
        return { success: false, reason: "DELETION_FAILED" };
      }

      // NOTE: repository.DELETE_ASSIGNMENT currently does NOT "RETURNING *"
      return { success: true, data: rows?.[0] ?? null };
    },
  };
}

/* ---------------------------------------------
 * Topics
 * --------------------------------------------- */
function createTopicsService(pool) {
  return {
    async listTopics(courseId) {
      const { rows } = await pool.query(repository.LIST_TOPICS, [courseId]);
      return { success: true, data: rows };
    },

    async createTopic(courseId, topic) {
      const { rows, rowCount } = await pool.query(repository.CREATE_TOPIC, [
        courseId,
        topic,
      ]);

      if (rowCount === 0) {
        return { success: false, reason: "CREATION_FAILED" };
      }

      return { success: true, data: rows[0] };
    },

    async deleteTopic(courseId, topicId) {
      const { rows, rowCount } = await pool.query(repository.DELETE_TOPIC, [
        courseId,
        topicId,
      ]);

      if (rowCount === 0) {
        return { success: false, reason: "DELETION_FAILED" };
      }

      return { success: true, data: rows[0] };
    },
  };
}

/* ---------------------------------------------
 * Grades
 * --------------------------------------------- */
function createGradesService(pool) {
  return {
    async listAllAssignmentGrades(courseId) {
      const { rows } = await pool.query(
        repository.LIST_ALL_ASSIGNMENT_GRADES,
        [courseId]
      );

      return { success: true, data: createGradesGridFromRows(rows) };
    },

    async listAssignmentGrades(assignmentId) {
      const { rows } = await pool.query(repository.LIST_ASSIGNMENT_GRADES, [
        assignmentId,
      ]);

      return { success: true, data: rows };
    },
  };
}

/* ---------------------------------------------
 * Submissions + Assignment submission settings
 * --------------------------------------------- */
function createSubmissionsService(pool) {
  return {
    async getAssignmentSubmissionStatus(courseId, assignmentId) {
      const { rows, rowCount } = await pool.query(
        repository.LIST_ASSIGNMENT_SUBMISSION_STATUS,
        [courseId, assignmentId]
      );

      if (rowCount === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      return { success: true, data: rows[0] };
    },

    async updateAssignmentSubmissionStatus(courseId, assignmentId, value) {
      const { rows, rowCount } = await pool.query(
        repository.UPDATE_ASSIGNMENT_SUBMISSION_STATUS,
        [courseId, assignmentId, value]
      );

      if (rowCount === 0) {
        return { success: false, reason: "UPDATE_FAILED" };
      }

      return { success: true, data: rows[0] };
    },

    async createStudentSubmission(assignmentId, studentMemberId, content) {
      const { rows, rowCount } = await pool.query(repository.GET_ASSIGNMENT_DUE_DATE, [assignmentId]);
      if (rowCount === 0) {
        return { success: false, reason: "ASSIGNMENT_DOES_NOT_EXIST" };
      }

      const dueDate = new Date(rows[0].due_date).getTime();
      if (Date.now() > dueDate) {
        return { success: false, reason: "PAST_DUE_DATE" };
      }

      const { rows: rows2, rowCount: rowCount2 } = await pool.query(
        repository.ADD_STUDENT_SUBMISSION,
        [assignmentId, studentMemberId, content]
      );

      if (rowCount2 === 0) {
        return { success: false, reason: "CREATION_FAILED" };
      }

      return { success: true, data: rows2[0] };
    },

    async updateStudentSubmissionMark(
      assignmentId,
      studentMemberId,
      mark,
      markerMemberId
    ) {
      const { rows, rowCount } = await pool.query(
        repository.UPDATE_STUDENT_SUBMISSION_MARK,
        [assignmentId, studentMemberId, mark, markerMemberId]
      );

      if (rowCount === 0) {
        return { success: false, reason: "UPDATE_FAILED" };
      }

      return { success: true, data: rows[0] };
    },

    async updateStudentSubmissionStatus(assignmentId, studentMemberId, status) {
      const { rows, rowCount } = await pool.query(
        repository.UPDATE_STUDENT_SUBMISSION_STATUS,
        [assignmentId, studentMemberId, status]
      );

      if (rowCount === 0) {
        return { success: false, reason: "UPDATE_FAILED" };
      }

      return { success: true, data: rows[0] };
    },
  };
}

export function createGradesGridFromRows(rows) {
  const studentMap = new Map();

  for (const row of rows) {
    const {
      user_id,
      user_name,
      user_avatar,
      assignment_id,
      assignment_name,
      total_marks,
      user_mark,
      submission_status,
      submitted_at,
    } = row;

    if (!studentMap.has(user_id)) {
      studentMap.set(user_id, {
        student: {
          userId: user_id,
          name: user_name,
          avatarUrl: user_avatar,
        },
        assignments: [],
      });
    }

    studentMap.get(user_id).assignments.push({
      assignmentId: assignment_id,
      assignmentName: assignment_name,
      totalMarks: total_marks,
      mark: user_mark,
      status: submission_status,
      submittedAt: submitted_at,
    });
  }

  return Array.from(studentMap.values());
}
