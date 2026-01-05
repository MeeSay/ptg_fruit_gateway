import { Router } from "express";
import { fruitController } from "../controllers/fruitController";
import { verifyFirebaseToken, verifyAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * Public routes
 */

router.get("/search", fruitController.searchFruits.bind(fruitController));
router.get("/", fruitController.getAllFruits.bind(fruitController));

export default router;
