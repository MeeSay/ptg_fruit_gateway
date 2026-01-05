import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import { config } from "./config";

// Load environment variables
dotenv.config();

// Initialize Firebase
import "./config/firebase";

const app: Application = express();

/**
 * Middleware
 */
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging

/**
 * Routes
 */
app.use("/api", routes);

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start server
 */
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║  PTGFruit API Gateway                     ║
  ║  Server running on port ${PORT}           ║
  ║  Environment: ${config.nodeEnv.padEnd(23)}║
  ║  http://localhost:${PORT}                 ║
  ╚═══════════════════════════════════════════╝
  `);
});

export default app;
