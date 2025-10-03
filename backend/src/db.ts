import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { schema } from "./model/schema";

let dbInstance: Database | null = null;

// SQLite wrapper makes life easier
export async function initDB() {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database,
  });

  await db.exec("PRAGMA journal_mode = WAL;");
  await db.exec("PRAGMA busy_timeout = 5000;");
  await db.exec("PRAGMA foreign_keys = ON");

  // Land table
  await db.exec(schema);

  dbInstance = db;
  return db;
}

// Helper to get the database instance
export async function getDB() {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
}
