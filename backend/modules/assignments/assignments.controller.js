// assignments.controller.js

function exists(...args) {
  return args.every((v) => v !== null && v !== undefined);
}

export function createAssignmentsController({ assignmentsService }) {
  return {
    // GET /assignments/:courseId
    async list(req, res) {
      const courseId = req.params.courseId;

      const result = await assignmentsService.listAssignments(courseId);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to list assignments" });
      }

      return res.json(result.data);
    },

    // POST /assignments/:courseId
    async create(req, res) {
      const courseId = req.params.courseId;
      const {
        creatorMemberId,
        topic = null,
        assignmentName,
        instructions,
        totalMarks,
      } = req.body;

      if (!exists(courseId, creatorMemberId, assignmentName, instructions, totalMarks)) {
        return res.status(400).json({ error: "Missing or incorrect input fields" });
      }

      const result = await assignmentsService.createAssignment(
        courseId,
        creatorMemberId,
        topic,
        assignmentName,
        instructions,
        totalMarks
      );

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create assignment" });
      }

      return res.status(201).json(result.data);
    },

    // DELETE /assignments
    async delete(req, res) {
      const assignmentId = req.body.assignmentId ?? req.params.assignmentId;

      if (!exists(assignmentId)) {
        return res.status(400).json({ error: "assignmentId is required" });
      }

      const result = await assignmentsService.deleteAssignment(assignmentId);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to delete assignment" });
      }
    },

    // GET /assignments/topics/:courseId
    async listTopics(req, res) {
      const courseId = req.params.courseId;
      const result = await assignmentsService.listTopics(courseId);

      if (!result || !result.success) {
        return res.status(500).json({ error: "Failed to list topics" });
      }

      return res.json(result.data);
    },

    // POST /assignments/topics/:courseId
    async createTopic(req, res) {
      const courseId = req.params.courseId;
      const { topic } = req.body;

      if (!exists(courseId, topic)) {
        return res.status(400).json({ error: "courseId and topic are required" });
      }

      const result = await assignmentsService.createTopic(courseId, topic);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create topic" });
      }
      return res.status(201).json(result.data);
    },

    // DELETE /assignments/topics/:courseId
    async deleteTopic(req, res) {
      const courseId = req.params.courseId;
      const { topic } = req.body;

      if (!exists(courseId, topic)) {
        return res.status(400).json({ error: "courseId and topic are required" });
      }

      const result = await assignmentsService.deleteTopic(courseId, topic);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to delete topic" });
      }
      return res.status(204).send();
    },
  };
}
