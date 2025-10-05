import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { schema } from "./model/schema";

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

// SQLite wrapper makes life easier
export async function initDB() {
  // If already initialized, return it
  if (dbInstance) {
    return dbInstance;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    const db = await open({
      filename: "./data.db",
      driver: sqlite3.Database,
    });

    // Enable WAL mode for better concurrent access
    await db.exec("PRAGMA journal_mode = WAL;");
    await db.exec("PRAGMA busy_timeout = 10000;"); // Increased to 10 seconds
    await db.exec("PRAGMA foreign_keys = ON;");

    // Additional pragmas for better performance
    await db.exec("PRAGMA synchronous = NORMAL;");
    await db.exec("PRAGMA cache_size = 10000;");
    await db.exec("PRAGMA temp_store = MEMORY;");

    // Create schema
    await db.exec(schema);

    dbInstance = db;
    return db;
  })();

  return initPromise;
}

// Helper to get the database instance
export async function getDB() {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
}
