import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { requireCourseMember } from "../../middleware/auth.middleware";

export function createPostsRouter({ postsController }) {
  const router = Router();

  const getPostsHandler = "/courses/:courseId/posts";
  router.get(
    getPostsHandler,
    requireCourseMember,
    asyncHandler(postsController.list)
  );

  const createPostHandler = "/courses/:courseId/posts";
  router.post(
    createPostHandler,
    requireCourseMember,
    asyncHandler(postsController.create)
  );

  const updateOrDeletePostHandler = "/posts/:postId";
  router.patch(
    updateOrDeletePostHandler,
    requireCourseMember,
    asyncHandler(postsController.update)
  );

  router.delete(
    updateOrDeletePostHandler,
    requireCourseMember,
    asyncHandler(postsController.delete)
  );

  const addCommentsToPostHandler = "/posts/:postId/comments";
  router.post(
    addCommentsToPostHandler,
    requireCourseMember,
    asyncHandler(postsController.addComment)
  );

  const deleteComment = "/posts/:postId/comments/:commentId";
  router.delete(
    deleteComment,
    requireCourseMember,
    asyncHandler(postsController.deleteComment)
  );

  return router;
}
