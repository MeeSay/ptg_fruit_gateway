import { Router } from "express";
import { userController } from "../controllers/userController";
import { verifyFirebaseToken, verifyAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * User profile routes
 */
router.get(
  "/me",
  verifyFirebaseToken,
  userController.getCurrentUser.bind(userController)
);

router.put(
  "/me",
  verifyFirebaseToken,
  userController.updateCurrentUser.bind(userController)
);

/**
 * Admin routes
 */
router.get(
  "/",
  verifyFirebaseToken,
  verifyAdmin,
  userController.getAllUsers.bind(userController)
);

router.get(
  "/:id",
  verifyFirebaseToken,
  verifyAdmin,
  userController.getUserById.bind(userController)
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  verifyAdmin,
  userController.deleteUser.bind(userController)
);

router.post(
  "/:id/admin",
  verifyFirebaseToken,
  verifyAdmin,
  userController.setAdmin.bind(userController)
);

export default router;
