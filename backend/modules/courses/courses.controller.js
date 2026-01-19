// courses.controller.js
export function createCoursesController({ coursesService }) {
  return {
    async list(req, res) {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const result = await coursesService.listCourses(userId);

      // listCourses should always succeed unless you start returning errors later
      if (!result.success) {
        return res.status(500).json({ error: "Failed to list courses" });
      }

      return res.json(result.data);
    },

    async create(req, res) {
      const { userId, courseName, courseRoom, bannerColor } = req.body;

      if (!userId || !courseName || !courseRoom || !bannerColor) {
        return res.status(400).json({
          error: "userId, courseName, courseRoom, and bannerColor are required",
        });
      }

      const result = await coursesService.createCourse(
        userId,
        courseName,
        courseRoom,
        bannerColor
      );

      if (!result.success) {
        return res.status(500).json({ error: "Failed to create course" });
      }

      return res.status(201).json(result.data);
    },

    async join(req, res) {
      const { userId, joinId, role } = req.body;

      if (!userId || !joinId || !role) {
        return res.status(400).json({ error: "Missing required information" });
      }

      const allowedRoles = new Set(["student", "teacher"]);
      if (!allowedRoles.has(role)) {
        return res.status(400).json({ error: "Access unauthorized" });
      }

      const result = await coursesService.joinCourse(userId, joinId, role);

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Invalid join code" });
        }
        if (result.reason === "JOIN_FAILED") {
          return res.status(400).json({ error: "Failed to join course" });
        }
        return res.status(500).json({ error: "Failed to join course" });
      }

      return res.json({ ok: true });
    },

    async delete(req, res) {
      const courseId = req.params.id;
      const { userId } = req.body;

      console.log(courseId, userId);

      if (!userId || !courseId) {
        return res.status(400).json({ error: "userId and courseId are required" });
      }

      const result = await coursesService.deleteCourse(userId, courseId);

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Course not found" });
        }
        if (result.reason === "FORBIDDEN") {
          return res.status(403).json({ error: "You are not allowed to delete this course" });
        }
        if (result.reason === "DELETE_FAILED") {
          return res.status(400).json({ error: "Could not delete course" });
        }
        return res.status(500).json({ error: "Failed to delete course" });
      }

      return res.status(204).send();
    },
  };
}
