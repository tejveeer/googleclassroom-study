import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";

export function createAuthRouter({ authController }) {
  const router = Router();

  router.get('/google', asyncHandler(authController.googleAuth));
  router.get('/google/callback', asyncHandler(authController.googleCallback));

  return router;
}
