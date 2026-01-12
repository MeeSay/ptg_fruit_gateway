import { Router } from "express";
import fruitRoutes from "./fruitRoutes";
import variantRoutes from "./variantRoutes";
import orderRoutes from "./orderRoutes";
import authRoutes from "./authRoutes";

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
router.use("/auth", authRoutes);
router.use("/fruits", fruitRoutes);
router.use("/variants", variantRoutes);
router.use("/orders", orderRoutes);

export default router;
