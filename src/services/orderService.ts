import { db } from "../config/firebase";
import { Order } from "../types";
import admin from "firebase-admin";

export class OrderService {
  private collectionName =
    process.env.PRODUCTION === "true" ? "orders" : "dev_orders";
  private fruitCollectionName =
    process.env.PRODUCTION === "true" ? "fruits" : "dev_fruits";
  private variantCollectionName =
    process.env.PRODUCTION === "true" ? "variants" : "dev_variants";

  /**
   * Get all order
   */
  async getAllOrders(
    type: "searching" | "available",
    option?: "newest" | "oldest",
    userId?: string,
    fruitId?: string,
    variantId?: string
  ): Promise<Order[]> {
    try {
      const querry = db.collection(this.collectionName);

      if (type === "available") {
        querry.where("type", "==", "available");
      } else if (type === "searching") {
        querry.where("type", "==", "searching");
      }

      if (userId) {
        querry.where("userId", "==", userId);
      }

      if (fruitId) {
        querry.where("fruitId", "==", fruitId);
      }

      if (variantId) {
        querry.where("variantId", "==", variantId);
      }

      const snapshot = await querry.get();
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({
          ...(doc.data() as Order),
          id: doc.id,
        });
      });

      // Sort orders based on option
      if (option === "newest") {
        orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // Descending order (newest first)
        });
      } else if (option === "oldest") {
        orders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB; // Ascending order (oldest first)
        });
      }

      return orders;
    } catch (error) {
      console.error("Error getting orders:", error);
      throw error;
    }
  }

  /**
   * Create new order
   */
  async createOrder(
    type: "searching" | "available",
    fruitId: string,
    variantId: string
  ): Promise<any> {
    try {
      // Validate required fields

      if (!fruitId || fruitId.trim() === "") {
        return {
          success: false,
          message: "fruitId is required and cannot be empty",
        };
      }

      if (!variantId || variantId.trim() === "") {
        return {
          success: false,
          message: "variantId is required and cannot be empty",
        };
      }

      if (!type || (type !== "searching" && type !== "available")) {
        return {
          success: false,
          message: "type must be 'searching' or 'available'",
        };
      }

      // Validate if fruit exists
      const fruitRef = db.collection(this.fruitCollectionName).doc(fruitId);
      const fruitDoc = await fruitRef.get();

      if (!fruitDoc.exists) {
        return {
          success: false,
          message: "Fruit not found",
        };
      }

      // Validate if variant exists
      const variantRef = db
        .collection(this.variantCollectionName)
        .doc(variantId);
      const variantDoc = await variantRef.get();

      if (!variantDoc.exists) {
        return {
          success: false,
          message: "Variant not found",
        };
      }

      const newOrder = {
        fruitId,
        variantId,
        type,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection(this.collectionName).add(newOrder);

      return {
        success: true,
        message: "Order created successfully",
        orderId: docRef.id,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

export const fruitService = new OrderService();
