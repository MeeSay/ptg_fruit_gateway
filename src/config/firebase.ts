import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Option 1: Using environment variables
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase initialized with environment variables");
    }
    // Option 2: Using service account file
    else {
      const serviceAccount = require("../../firebase-service-account.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
      console.log("Firebase initialized with service account file");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
};

initializeFirebase();

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

export default admin;
