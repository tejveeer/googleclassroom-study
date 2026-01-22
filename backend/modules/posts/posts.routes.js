import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireCourseMember } from "../../middlewares/auth.middleware.js";

export function createPostsRouter({ postsController, pool }) {
  const router = Router();

  const getPostsHandler = "/:courseId/";
  router.get(
    getPostsHandler,
    requireCourseMember(pool),
    asyncHandler(postsController.list)
  );

  const createPostHandler = "/:courseId/";
  router.post(
    createPostHandler,
    requireCourseMember(pool),
    asyncHandler(postsController.create)
  );

  const updatePostHandler = "/:postId";
  router.patch(
    updatePostHandler,
    requireCourseMember(pool),
    asyncHandler(postsController.update)
  );

  const deletePostHandler = "/:postId";
  router.delete(
    deletePostHandler,
    requireCourseMember(pool),
    asyncHandler(postsController.delete)
  );

  const addCommentsToPostHandler = "/:postId/comments";
  router.post(
    addCommentsToPostHandler,
    requireCourseMember(pool),
    asyncHandler(postsController.addComment)
  );

  const deleteComment = "/:postId/comments/:commentId";
  router.delete(
    deleteComment,
    requireCourseMember(pool),
    asyncHandler(postsController.deleteComment)
  );

  return router;
}
