import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js"

export function createAuthRouter({ authController }) {
  const router = Router();

  router.get('/google', asyncHandler(authController.googleAuth));
  router.get('/google/callback', asyncHandler(authController.googleCallback));
  router.get('/me', requireAuth, asyncHandler(authController.getMe));

  return router;
}
