import { Request, Response } from "express";
import { fruitService } from "../services/fruitService";
import { ApiResponse, Fruit } from "../types";

export class FruitController {
  /**
   * Get all fruits
   */
  async getAllFruits(req: Request, res: Response): Promise<void> {
    try {
      const fruits = await fruitService.getAllFruits();

      const response: ApiResponse<Fruit[]> = {
        success: true,
        message: "Fruits retrieved successfully",
        data: fruits,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve fruits",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
  /**
   * Search fruits by ID
   */
  async searchFruits(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        const response: ApiResponse = {
          success: false,
          message: "Search query is required",
        };
        res.status(400).json(response);
        return;
      }

      const fruits = await fruitService.searchFruits(id.toString());

      const response: ApiResponse<Fruit[]> = {
        success: true,
        message: "Search completed successfully",
        data: fruits,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to search fruits",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

export const fruitController = new FruitController();
