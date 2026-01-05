import { Request, Response } from "express";
import { variantService } from "../services/variantService";
import { ApiResponse, Variant } from "../types";

export class VariantController {
  /**
   * Get all variants
   */
  async getAllVariants(req: Request, res: Response): Promise<void> {
    try {
      const variants = await variantService.getAllVariants();
      const response: ApiResponse<Variant[]> = {
        success: true,
        message: "Variants retrieved successfully",
        data: variants,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve variants",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
  /**
   * Search variants by ID
   */
  async searchVariants(req: Request, res: Response): Promise<void> {
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

      const variants = await variantService.searchVariants(id.toString());

      const response: ApiResponse<Variant[]> = {
        success: true,
        message: "Search completed successfully",
        data: variants,
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

export const variantController = new VariantController();
