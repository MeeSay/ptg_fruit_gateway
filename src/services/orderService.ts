import { db } from "../config/firebase";
import { Order } from "../types";

export class OrderService {
  private collectionName = "orders";

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      const orders: Order[] = [];

      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as Order;
    } catch (error) {
      console.error("Error getting order:", error);
      throw error;
    }
  }

  /**
   * Create new order
   */
  async createOrder(orderData: Omit<Order, "id">): Promise<Order> {
    try {
      const docRef = await db.collection(this.collectionName).add({
        ...orderData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newOrder = await this.getOrderById(docRef.id);
      return newOrder!;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    status: Order["status"]
  ): Promise<Order | null> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      await docRef.update({
        status,
        updatedAt: new Date(),
      });

      return await this.getOrderById(id);
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  /**
   * Get all orders (admin only)
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const snapshot = await db
        .collection(this.collectionName)
        .orderBy("createdAt", "desc")
        .get();

      const orders: Order[] = [];

      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      return orders;
    } catch (error) {
      console.error("Error getting all orders:", error);
      throw error;
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(id: string): Promise<boolean> {
    try {
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
