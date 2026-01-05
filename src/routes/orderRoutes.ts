import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { verifyFirebaseToken, verifyAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * User order routes
 */
router.get(
  "/my-orders",
  verifyFirebaseToken,
  orderController.getUserOrders.bind(orderController)
);

router.get(
  "/:id",
  verifyFirebaseToken,
  orderController.getOrderById.bind(orderController)
);

router.post(
  "/",
  verifyFirebaseToken,
  orderController.createOrder.bind(orderController)
);

/**
 * Admin routes
 */
router.get(
  "/",
  verifyFirebaseToken,
  verifyAdmin,
  orderController.getAllOrders.bind(orderController)
);

router.put(
  "/:id/status",
  verifyFirebaseToken,
  verifyAdmin,
  orderController.updateOrderStatus.bind(orderController)
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  verifyAdmin,
  orderController.deleteOrder.bind(orderController)
);

export default router;
