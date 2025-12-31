// posts.service.js
import { repository } from "./posts.data-access.js";

export function createPostsService({ pool }) {
  const FK_COURSE_MEMBERS_VIOLATION = "23503";

  return {
    async listPosts(courseId) {
      const { rows } = await pool.query(repository.LIST_POSTS, [courseId]);
      return { success: true, data: rows };
    },

    async createPost(memberId, courseId, content) {
      try {
        const { rows } = await pool.query(repository.CREATE_POST, [
          courseId,
          memberId,
          content,
        ]);

        return { success: true, data: rows[0] };
      } catch (err) {
        if (err.code === FK_COURSE_MEMBERS_VIOLATION) {
          return { success: false, reason: "NOT_A_MEMBER" };
        }
        return { success: false };
      }
    },

    async updatePost(memberId, postId, content) {
      const { rows: existing } = await pool.query(
        repository.DOES_POST_EXIST,
        [postId]
      );

      if (existing.length === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      if (existing[0].member_id !== memberId) {
        return { success: false, reason: "FORBIDDEN" };
      }

      try {
        const { rows } = await pool.query(repository.UPDATE_POST, [
          postId,
          memberId,
          content,
        ]);

        return { success: true, data: rows[0] };
      } catch (err) {
        if (err.code === FK_COURSE_MEMBERS_VIOLATION) {
          return { success: false, reason: "NOT_A_MEMBER" };
        }
        return { success: false };
      }
    },

    async deletePost(memberId, postId) {
      const { rows: existing } = await pool.query(
        repository.DOES_POST_EXIST,
        [postId]
      );

      if (existing.length === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      if (existing[0].member_id !== memberId) {
        return { success: false, reason: "FORBIDDEN" };
      }

      try {
        const { rowCount } = await pool.query(repository.DELETE_POST, [
          postId,
          memberId,
        ]);

        if (rowCount === 0) return { success: false };

        return { success: true };
      } catch {
        if (err.code === FK_COURSE_MEMBERS_VIOLATION) {
          return { success: false, reason: "NOT_A_MEMBER" };
        }
        return { success: false };
      }
    },

    async createComment(memberId, postId, content) {
      try {
        const { rows } = await pool.query(repository.CREATE_COMMENT, [
          postId,
          memberId,
          content,
        ]);

        return { success: true, data: rows[0] };
      } catch (err) {
        if (err.code === FK_COURSE_MEMBERS_VIOLATION) {
          return { success: false, reason: "NOT_A_MEMBER" };
        }
        return { success: false };
      }
    },

    async deleteComment(memberId, commentId) {
      const { rows: existing } = await pool.query(
        repository.DOES_COMMENT_EXIST,
        [commentId]
      );

      if (existing.length === 0) {
        return { success: false, reason: "NOT_FOUND" };
      }

      if (existing[0].member_id !== memberId) {
        return { success: false, reason: "FORBIDDEN" };
      }

      try {
        const { rowCount } = await pool.query(repository.DELETE_COMMENT, [
          commentId,
          memberId,
        ]);

        if (rowCount === 0) return { success: false };

        return { success: true };
      } catch {
        if (err.code === FK_COURSE_MEMBERS_VIOLATION) {
          return { success: false, reason: "NOT_A_MEMBER" };
        }
        return { success: false };
      }
    },
  };
}
