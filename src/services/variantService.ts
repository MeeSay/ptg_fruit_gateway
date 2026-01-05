import { db } from "../config/firebase";
import { Variant } from "../types";

export class VariantService {
  private collectionName =
    process.env.PRODUCTION === "true" ? "variants" : "dev_variants";
  private cache: Map<string, { data: Variant[]; timestamp: number }> =
    new Map();
  private CACHE_TTL = 60000; // 1 phút

  /**
   * Get all variants
   */
  async getAllVariants(): Promise<Variant[]> {
    try {
      const cacheKey = "all_variants";
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log("Returning cached variants");
        return cached.data;
      }

      console.log("Fetching variants from Firestore");
      const snapshot = await db.collection(this.collectionName).get();
      const variants: Variant[] = [];
      snapshot.forEach((doc) => {
        variants.push({
          ...(doc.data() as Variant),
          id: Number(doc.id),
        });
      });

      this.cache.set(cacheKey, { data: variants, timestamp: Date.now() });
      return variants;
    } catch (error) {
      console.error("Error getting variants:", error);
      throw error;
    }
  }

  /**
   * Search variants by name or category
   */
  async searchVariants(query: string): Promise<Variant[]> {
    try {
      const cacheKey = `variant_${query}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`Returning cached variant: ${query}`);
        return cached.data;
      }

      console.log(`Fetching variant from Firestore: ${query}`);
      // Query trực tiếp document thay vì fetch all
      const docRef = db.collection(this.collectionName).doc(query);
      const doc = await docRef.get();

      if (!doc.exists) {
        return [];
      }

      const result = [
        {
          ...(doc.data() as Variant),
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

export const variantService = new VariantService();
