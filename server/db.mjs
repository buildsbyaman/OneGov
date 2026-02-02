import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "OneGov";

let client = null;
let db = null;

export async function connectToDatabase() {
  if (db) return { client, db };

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB successfully (DB: ${DB_NAME})`);
    console.log(
      `🔗 Connection URI: ${MONGODB_URI.replace(/:[^@]*@/, ":****@")}`,
    );
    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return client.db(DB_NAME);
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
