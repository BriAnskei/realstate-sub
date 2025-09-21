import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { schema } from "./model/schema";

// SQLite wrapper makes life easier
export async function initDB() {
  const db = await open({
    filename: "./data.db",
    driver: sqlite3.Database,
  });

  await db.exec("PRAGMA foreign_keys = ON");

  //   Land table
  await db.exec(schema);

  return db;
}
