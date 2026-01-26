// people.controller.js
export function createPeopleController({ peopleService }) {
  return {
    async listTeachers(req, res) {
      const courseId = req.params.courseId;

      if (!courseId) {
        return res.status(400).json({ error: "courseId is required" });
      }

      const result = await peopleService.listTeachers(courseId);
      return res.json(result.data);
    },

    async listStudents(req, res) {
      const courseId = req.params.courseId;

      if (!courseId) {
        return res.status(400).json({ error: "courseId is required" });
      }

      const result = await peopleService.listStudents(courseId);
      console.log("students rows count", result.data.length);
      return res.json(result.data);
    },

    async deleteCourseMember(req, res) {
      const courseId = req.params.courseId;
      const memberId = req.params.memberId;

      if (!courseId || !memberId) {
        return res.status(400).json({ error: "courseId and memberId are required" });
      }

      const result = await peopleService.deleteCourseMember(courseId, memberId);

      console.log("deleteCourseMember result", result);
      if (!result?.success) {
        if (result.reason === "NON_EXISTENT_USER") {
          return res.status(404).json({ error: "Member not found in this course" });
        }
        console.log(result)
        return res.status(500).json({ error: "Failed to delete course member" });
      }

      return res.status(200).json(result.data);
    },
  };
}
