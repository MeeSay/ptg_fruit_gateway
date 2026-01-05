import { auth, db } from "../config/firebase";
import { User } from "../types";

export class UserService {
  private collectionName = "users";

  /**
   * Get user by ID
   */
  async getUserById(uid: string): Promise<User | null> {
    try {
      const doc = await db.collection(this.collectionName).doc(uid).get();

      if (!doc.exists) {
        return null;
      }

      return {
        uid: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Create or update user profile
   */
  async createOrUpdateUser(
    uid: string,
    userData: Partial<User>
  ): Promise<User> {
    try {
      const docRef = db.collection(this.collectionName).doc(uid);
      const doc = await docRef.get();

      if (doc.exists) {
        await docRef.update({
          ...userData,
          updatedAt: new Date(),
        });
      } else {
        await docRef.set({
          uid,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const user = await this.getUserById(uid);
      return user!;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await db.collection(this.collectionName).get();
      const users: User[] = [];

      snapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data(),
        } as User);
      });

      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<boolean> {
    try {
      // Delete from Firebase Auth
      await auth.deleteUser(uid);

      // Delete from Firestore
      await db.collection(this.collectionName).doc(uid).delete();

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * Set custom claims (e.g., admin role)
   */
  async setCustomClaims(uid: string, claims: object): Promise<void> {
    try {
      await auth.setCustomUserClaims(uid, claims);
    } catch (error) {
      console.error("Error setting custom claims:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
