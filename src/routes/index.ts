import { Router } from "express";
import fruitRoutes from "./fruitRoutes";
import userRoutes from "./userRoutes";
import orderRoutes from "./orderRoutes";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use("/fruits", fruitRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);

export default router;
