import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * Protected routes - require authentication
 */

// Get all orders
router.get(
  "/",
  verifyFirebaseToken,
  orderController.getAllOrders.bind(orderController)
);

// Create new order
router.post(
  "/",
  verifyFirebaseToken,
  orderController.createOrder.bind(orderController)
);

export default router;
