import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

/**
 * Auth routes for testing
 */

// Verify token
router.post("/verify", authController.verifyToken.bind(authController));

// Get custom token (for testing)
router.post(
  "/custom-token",
  authController.getCustomToken.bind(authController)
);

// Login info (instructions)
router.post("/login", authController.login.bind(authController));

export default router;
