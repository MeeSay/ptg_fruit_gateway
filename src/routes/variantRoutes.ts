import { Router } from "express";
import { variantController } from "../controllers/variantController";
import { verifyFirebaseToken, verifyAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * Public routes
 */

router.get("/search", variantController.searchVariants.bind(variantController));
router.get("/", variantController.getAllVariants.bind(variantController));

export default router;
