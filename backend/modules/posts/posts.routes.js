import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireCourseMember } from "../../middlewares/auth.middleware.js";

export function createPostsRouter({ postsController }) {
  const router = Router();

  const getPostsHandler = "/posts/:courseId/";
  router.get(
    getPostsHandler,
    requireCourseMember,
    asyncHandler(postsController.list)
  );

  const createPostHandler = "/posts/:courseId/";
  router.post(
    createPostHandler,
    requireCourseMember,
    asyncHandler(postsController.create)
  );

  const updatePostHandler = "/posts/:postId";
  router.patch(
    updatePostHandler,
    requireCourseMember,
    asyncHandler(postsController.update)
  );

  const deletePostHandler = "/posts/:postId";
  router.delete(
    deletePostHandler,
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
