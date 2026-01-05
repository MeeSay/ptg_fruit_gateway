import { Response } from "express";
import { userService } from "../services/userService";
import { ApiResponse, User } from "../types";
import { AuthRequest } from "../middleware/authMiddleware";

export class UserController {
  /**
   * Get current user profile
   */
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: "User not authenticated",
        };
        res.status(401).json(response);
        return;
      }

      const user = await userService.getUserById(req.user.uid);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: "User not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve user",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: "User not authenticated",
        };
        res.status(401).json(response);
        return;
      }

      const userData = req.body;
      const updatedUser = await userService.createOrUpdateUser(
        req.user.uid,
        userData
      );

      const response: ApiResponse<User> = {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      const response: ApiResponse<User[]> = {
        success: true,
        message: "Users retrieved successfully",
        data: users,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve users",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: "User not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve user",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Set user as admin (admin only)
   */
  async setAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await userService.setCustomClaims(id, { admin: true });

      const response: ApiResponse = {
        success: true,
        message: "User set as admin successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to set user as admin",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

export const userController = new UserController();
