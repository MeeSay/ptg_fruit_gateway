import { Response } from "express";
import { orderService } from "../services/orderService";
import { ApiResponse, Order } from "../types";
import { AuthRequest } from "../middleware/authMiddleware";

export class OrderController {
  /**
   * Get current user's orders
   */
  async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: "User not authenticated",
        };
        res.status(401).json(response);
        return;
      }

      const orders = await orderService.getUserOrders(req.user.uid);

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
   * Get order by ID
   */
  async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        const response: ApiResponse = {
          success: false,
          message: "Order not found",
        };
        res.status(404).json(response);
        return;
      }

      // Check if user owns the order or is admin
      if (
        req.user &&
        order.userId !== req.user.uid &&
        req.user.role !== "admin"
      ) {
        const response: ApiResponse = {
          success: false,
          message: "Forbidden",
        };
        res.status(403).json(response);
        return;
      }

      const response: ApiResponse<Order> = {
        success: true,
        message: "Order retrieved successfully",
        data: order,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to retrieve order",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Create new order
   */
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: "User not authenticated",
        };
        res.status(401).json(response);
        return;
      }

      const orderData = {
        ...req.body,
        userId: req.user.uid,
      };

      const newOrder = await orderService.createOrder(orderData);

      const response: ApiResponse<Order> = {
        success: true,
        message: "Order created successfully",
        data: newOrder,
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

  /**
   * Update order status
   */
  async updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        const response: ApiResponse = {
          success: false,
          message: "Status is required",
        };
        res.status(400).json(response);
        return;
      }

      const updatedOrder = await orderService.updateOrderStatus(id, status);

      if (!updatedOrder) {
        const response: ApiResponse = {
          success: false,
          message: "Order not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Order> = {
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to update order status",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const orders = await orderService.getAllOrders();

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
   * Delete order (admin only)
   */
  async deleteOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await orderService.deleteOrder(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          message: "Order not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "Order deleted successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to delete order",
        error: error instanceof Error ? error.message : "Unknown error",
      };
      res.status(500).json(response);
    }
  }
}

export const orderController = new OrderController();
