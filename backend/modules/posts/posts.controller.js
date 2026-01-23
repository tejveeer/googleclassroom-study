// posts.controller.js
export function createPostsController({ postsService }) {
  return {
    // GET /courses/:courseId/posts
    async list(req, res) {
      const { courseId } = req.params;

      if (!courseId) {
        return res.status(400).json({ error: "courseId is required" });
      }

      const result = await postsService.listPosts(courseId);

      if (!result.success) {
        return res.status(500).json({ error: "Failed to list posts" });
      }

      return res.json(result.data);
    },

    // POST /courses/:courseId/posts
    async create(req, res) {
      const { courseId } = req.params;
      const { memberId, content } = req.body;

      console.log(courseId, memberId, content);
      if (!courseId || !memberId || !content) {
        return res
          .status(400)
          .json({ error: "courseId, memberId, and content are required" });
      }

      const result = await postsService.createPost(memberId, courseId, content);

      if (!result.success) {
        if (result.reason === "NOT_A_MEMBER") {
          return res
            .status(403)
            .json({ error: "You are not a member of this course" });
        }
        return res.status(500).json({ error: "Failed to create post" });
      }

      return res.status(201).json(result.data);
    },

    // PATCH /posts/:postId
    async update(req, res) {
      const { postId } = req.params;
      const { memberId, content } = req.body;
      console.log("Updating post with postId: ", postId);

      if (!postId || !memberId || !content) {
        return res
          .status(400)
          .json({ error: "postId, memberId, and content are required" });
      }

      const result = await postsService.updatePost(memberId, postId, content);

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Post not found" });
        }
        if (result.reason === "FORBIDDEN") {
          return res
            .status(403)
            .json({ error: "You are not allowed to edit this post" });
        }
        if (result.reason === "NOT_A_MEMBER") {
          return res
            .status(403)
            .json({ error: "You are not a member of this course" });
        }
        return res.status(500).json({ error: "Failed to update post" });
      }

      return res.json(result.data);
    },

    // DELETE /posts/:postId
    async delete(req, res) {
      const { postId } = req.params;
      const { memberId } = req.body;

      if (!postId || !memberId) {
        return res
          .status(400)
          .json({ error: "postId and memberId are required" });
      }

      const result = await postsService.deletePost(memberId, postId);

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Post not found" });
        }
        if (result.reason === "FORBIDDEN") {
          return res
            .status(403)
            .json({ error: "You are not allowed to delete this post" });
        }
        if (result.reason === "NOT_A_MEMBER") {
          return res
            .status(403)
            .json({ error: "You are not a member of this course" });
        }
        return res.status(500).json({ error: "Failed to delete post" });
      }

      return res.status(204).send();
    },

    // POST /posts/:postId/comments
    async addComment(req, res) {
      const { postId } = req.params;
      const { memberId, content } = req.body;

      if (!postId || !memberId || !content) {
        return res
          .status(400)
          .json({ error: "postId, memberId, and content are required" });
      }

      const result = await postsService.createComment(memberId, postId, content);

      if (!result.success) {
        if (result.reason === "NOT_A_MEMBER") {
          return res
            .status(403)
            .json({ error: "You are not allowed to comment on this post" });
        }
        return res.status(500).json({ error: "Failed to create comment" });
      }

      return res.status(201).json(result.data);
    },

    // DELETE /comments/:commentId
    async deleteComment(req, res) {
      const { commentId } = req.params;
      const { memberId } = req.body;

      if (!commentId || !memberId) {
        return res
          .status(400)
          .json({ error: "commentId and memberId are required" });
      }

      const result = await postsService.deleteComment(memberId, commentId);

      if (!result.success) {
        if (result.reason === "NOT_FOUND") {
          return res.status(404).json({ error: "Comment not found" });
        }
        if (result.reason === "FORBIDDEN") {
          return res
            .status(403)
            .json({ error: "You are not allowed to delete this comment" });
        }
        if (result.reason === "NOT_A_MEMBER") {
          return res
            .status(403)
            .json({ error: "You are not a member of this course" });
        }
        return res.status(500).json({ error: "Failed to delete comment" });
      }

      return res.status(204).send();
    },
  };
}
