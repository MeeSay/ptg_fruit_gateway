import { Request, Response } from "express";
import { auth } from "../config/firebase";
import { ApiResponse } from "../types";

export class AuthController {
  /**
   * Login with email and password - Returns Firebase ID token
   * This is for testing purposes with Postman
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response: ApiResponse = {
          success: false,
          message: "Email and password are required",
        };
        res.status(400).json(response);
        return;
      }

      // Note: Firebase Admin SDK doesn't support email/password login
      // You need to use Firebase Client SDK or REST API
      const response: ApiResponse = {
        success: false,
        message: "Please use Firebase REST API for login",
        data: {
          apiKey: process.env.FIREBASE_API_KEY,
          endpoint:
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY",
          method: "POST",
          body: {
            email: "user@example.com",
            password: "password",
            returnSecureToken: true,
          },
        },
      };

      res.status(400).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Verify token - Test if token is valid
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const response: ApiResponse = {
          success: false,
          message: "No token provided",
        };
        res.status(401).json(response);
        return;
      }

      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(idToken);

      const response: ApiResponse = {
        success: true,
        message: "Token is valid",
        data: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          role: decodedToken.role || "user",
        },
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid token",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(401).json(response);
    }
  }

  /**
   * Get custom token for testing - Create custom token from UID
   */
  async getCustomToken(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.body;

      if (!uid) {
        const response: ApiResponse = {
          success: false,
          message: "UID is required",
        };
        res.status(400).json(response);
        return;
      }

      const customToken = await auth.createCustomToken(uid);

      const response: ApiResponse = {
        success: true,
        message: "Custom token created successfully",
        data: {
          customToken,
          note: "Exchange this custom token for an ID token using Firebase Client SDK",
        },
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to create custom token",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

export const authController = new AuthController();
