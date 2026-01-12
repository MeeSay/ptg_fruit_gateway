import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { ApiResponse, Order } from "../types";

const orderService = new OrderService();

export class OrderController {
  /**
   * Get all orders
   */
  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { type, option, userId, fruitId, variantId } = req.query;

      if (!type || (type !== "searching" && type !== "available")) {
        const response: ApiResponse = {
          success: false,
          message:
            "Type parameter is required and must be 'search' or 'available'",
        };
        res.status(400).json(response);
        return;
      }

      const orders = await orderService.getAllOrders(
        type as "searching" | "available",
        option as "newest" | "oldest" | undefined,
        userId as string | undefined,
        fruitId as string | undefined,
        variantId as string | undefined
      );

      const response: ApiResponse<Order[]> = {
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve orders",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Create new order
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { type, fruitId, variantId } = req.body;

      if (!type || (type !== "searching" && type !== "available")) {
        const response: ApiResponse = {
          success: false,
          message: "Type is required and must be 'searching' or 'available'",
        };
        res.status(400).json(response);
        return;
      }

      if (!fruitId || !variantId) {
        const response: ApiResponse = {
          success: false,
          message: "fruitId and variantId are required",
        };
        res.status(400).json(response);
        return;
      }

      const result = await orderService.createOrder(type, fruitId, variantId);

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        data: { orderId: result.orderId },
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

export const orderController = new OrderController();
