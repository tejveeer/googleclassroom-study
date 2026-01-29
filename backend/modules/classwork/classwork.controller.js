// classwork.controller.js

function exists(...args) {
  return args.every((v) => v !== null && v !== undefined);
}

export function createClassworkController({ classworkService }) {
  const assignments = createAssignmentsController({ classworkService });
  const topics = createTopicsController({ classworkService });
  const grades = createGradesController({ classworkService });
  const submissions = createSubmissionsController({ classworkService });

  return {
    ...assignments,
    ...topics,
    ...grades,
    ...submissions,
  };
}

/* ---------------------------------------------
 * Assignments controller
 * --------------------------------------------- */
function createAssignmentsController({ classworkService }) {
  return {
    async listAssignments(req, res) {
      const courseId = req.params.courseId;

      const result = await classworkService.listAssignments(courseId);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to list assignments" });
      }

      return res.json(result.data);
    },

    async createAssignment(req, res) {
      const courseId = req.params.courseId;
      const {
        memberId,
        topic = null,
        assignmentName,
        instructions,
        totalMarks,
        dueDate
      } = req.body;

      console.log(courseId, memberId, assignmentName, instructions, totalMarks, dueDate);
      if (
        !exists(courseId, memberId, assignmentName, instructions, totalMarks, dueDate)
      ) {
        return res
          .status(400)
          .json({ error: "Missing or incorrect input fields" });
      }

      const result = await classworkService.createAssignment(
        courseId,
        memberId,
        topic,
        assignmentName,
        instructions,
        totalMarks,
        dueDate
      );

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create assignment" });
      }

      return res.status(201).json(result.data);
    },

    async deleteAssignment(req, res) {
      const assignmentId = req.params.assignmentId;

      if (!exists(assignmentId)) {
        return res.status(400).json({ error: "assignmentId is required" });
      }

      const result = await classworkService.deleteAssignment(assignmentId);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to delete assignment" });
      }

      return res.status(204).send();
    },
  };
}

/* ---------------------------------------------
 * Topics controller
 * --------------------------------------------- */
function createTopicsController({ classworkService }) {
  return {
    async listTopics(req, res) {
      const courseId = req.params.courseId;
      const result = await classworkService.listTopics(courseId);

      if (!result || !result.success) {
        return res.status(500).json({ error: "Failed to list topics" });
      }

      return res.json(result.data);
    },

    async createTopic(req, res) {
      const courseId = req.params.courseId;
      const { topic } = req.body;

      if (!exists(courseId, topic)) {
        return res.status(400).json({ error: "courseId and topic are required" });
      }

      const result = await classworkService.createTopic(courseId, topic);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create topic" });
      }

      return res.status(201).json(result.data);
    },

    async deleteTopic(req, res) {
      const courseId = req.params.courseId;
      const { topic } = req.body;

      if (!exists(courseId, topic)) {
        return res.status(400).json({ error: "courseId and topic are required" });
      }

      const result = await classworkService.deleteTopic(courseId, topic);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to delete topic" });
      }

      return res.status(204).send();
    },
  };
}

/* ---------------------------------------------
 * Grades controller
 * --------------------------------------------- */
function createGradesController({ classworkService }) {
  return {
    async listAllAssignmentGrades(req, res) {
      const courseId = req.params.courseId;

      if (!exists(courseId)) {
        return res.status(400).json({ error: "courseId is required" });
      }

      const result = await classworkService.listAllAssignmentGrades(courseId);

      if (!result.success) {
        return res
          .status(500)
          .json({ error: "Failed to list assignment grades" });
      }

      return res.json(result.data);
    },

    async listAssignmentGrades(req, res) {
      const assignmentId = req.params.assignmentId;

      if (!exists(assignmentId)) {
        return res.status(400).json({ error: "assignmentId is required" });
      }

      const result = await classworkService.listAssignmentGrades(assignmentId);

      if (!result.success) {
        return res
          .status(500)
          .json({ error: "Failed to list assignment grades" });
      }

      return res.json(result.data);
    },
  };
}

/* ---------------------------------------------
 * Submissions controller
 * --------------------------------------------- */
function createSubmissionsController({ classworkService }) {
  return {
    async getAssignmentSubmissionStatus(req, res) {
      const courseId = req.params.courseId;
      const assignmentId = req.params.assignmentId;

      if (!exists(courseId, assignmentId)) {
        return res
          .status(400)
          .json({ error: "courseId and assignmentId are required" });
      }

      const result = await classworkService.getAssignmentSubmissionStatus(
        courseId,
        assignmentId
      );

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Assignment not found" });
        }
        return res.status(500).json({ error: "Failed to get submission status" });
      }

      return res.json(result.data);
    },

    async updateAssignmentSubmissionStatus(req, res) {
      const courseId = req.params.courseId;
      const assignmentId = req.params.assignmentId;

      if (!exists(courseId, assignmentId)) {
        return res
          .status(400)
          .json({ error: "courseId and assignmentId are required" });
      }

      const result = await classworkService.updateAssignmentSubmissionStatus(
        courseId,
        assignmentId
      );

      if (!result.success) {
        return res
          .status(500)
          .json({ error: "Failed to update submission status" });
      }

      return res.json(result.data);
    },

    async createStudentSubmission(req, res) {
      const assignmentId = req.params.assignmentId;
      const { studentMemberId, content } = req.body;

      if (!exists(assignmentId, studentMemberId, content)) {
        return res.status(400).json({
          error: "assignmentId, studentMemberId, and content are required",
        });
      }

      const result = await classworkService.createStudentSubmission(
        assignmentId,
        studentMemberId,
        content
      );

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create submission" });
      }

      return res.status(201).json(result.data);
    },

    async updateStudentSubmissionMark(req, res) {
      const assignmentId = req.params.assignmentId;
      const { studentMemberId, mark, markerMemberId } = req.body;

      if (!exists(assignmentId, studentMemberId, mark, markerMemberId)) {
        return res.status(400).json({
          error:
            "assignmentId, studentMemberId, mark, and markerMemberId are required",
        });
      }

      const result = await classworkService.updateStudentSubmissionMark(
        assignmentId,
        studentMemberId,
        mark,
        markerMemberId
      );

      if (!result.success) {
        return res.status(500).json({ error: "Failed to update submission mark" });
      }

      return res.json(result.data);
    },

    async updateStudentSubmissionStatus(req, res) {
      const assignmentId = req.params.assignmentId;
      const { studentMemberId, status } = req.body;

      if (!exists(assignmentId, studentMemberId, status)) {
        return res.status(400).json({
          error: "assignmentId, studentMemberId, and status are required",
        });
      }

      const result = await classworkService.updateStudentSubmissionStatus(
        assignmentId,
        studentMemberId,
        status
      );

      if (!result.success) {
        return res
          .status(500)
          .json({ error: "Failed to update submission status" });
      }

      return res.json(result.data);
    },
  };
}
