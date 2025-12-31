import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";

export function createPostsRouter({ postsController }) {
  const router = Router();

  const getPostsHandler = "/courses/:courseId/posts";
  router.get(
    getPostsHandler,
    asyncHandler(postsController.list)
  );

  const createPostHandler = "/courses/:courseId/posts";
  router.post(
    createPostHandler,
    asyncHandler(postsController.create)
  );

  const updateOrDeletePostHandler = "/posts/:postId";
  router.patch(
    updateOrDeletePostHandler,
    asyncHandler(postsController.update)
  );

  router.delete(
    updateOrDeletePostHandler,
    asyncHandler(postsController.delete)
  );

  const addCommentsToPostHandler = "/posts/:postId/comments";
  router.post(
    addCommentsToPostHandler,
    asyncHandler(postsController.addComment)
  );

  const deleteComment = "/posts/:postId/comments/:commentId";
  router.delete(
    deleteComment,
    asyncHandler(postsController.deleteComment)
  );

  return router;
}
