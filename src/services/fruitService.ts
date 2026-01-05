import { db } from "../config/firebase";
import { Fruit } from "../types";

export class FruitService {
  private collectionName =
    process.env.PRODUCTION === "true" ? "fruits" : "dev_fruits";
  private cache: Map<string, { data: Fruit[]; timestamp: number }> = new Map();
  private CACHE_TTL = 60000; // 1 phút

  /**
   * Get all fruits
   */
  async getAllFruits(): Promise<Fruit[]> {
    try {
      const cacheKey = "all_fruits";
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log("Returning cached fruits");
        return cached.data;
      }

      console.log("Fetching fruits from Firestore");
      const snapshot = await db.collection(this.collectionName).get();
      const fruits: Fruit[] = [];
      snapshot.forEach((doc) => {
        fruits.push({
          ...(doc.data() as Fruit),
          id: Number(doc.id),
        });
      });

      this.cache.set(cacheKey, { data: fruits, timestamp: Date.now() });
      return fruits;
    } catch (error) {
      console.error("Error getting fruits:", error);
      throw error;
    }
  }

  /**
   * Search fruits by name or category
   */
  async searchFruits(query: string): Promise<Fruit[]> {
    try {
      const cacheKey = `fruit_${query}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`Returning cached fruit: ${query}`);
        return cached.data;
      }

      console.log(`Fetching fruit from Firestore: ${query}`);
      // Query trực tiếp document thay vì fetch all
      const docRef = db.collection(this.collectionName).doc(query);
      const doc = await docRef.get();

      if (!doc.exists) {
        return [];
      }

      const result = [
        {
          ...(doc.data() as Fruit),
          id: Number(doc.id),
        },
      ];

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error("Error searching fruits:", error);
      throw error;
    }
  }
}

export const fruitService = new FruitService();
