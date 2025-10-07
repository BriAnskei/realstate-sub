import { Database } from "sqlite";

export class LotService {
  static parseArrayIfNeeded(data: any) {
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    return data;
  }
  static filterOutProp<T extends Record<string, any>>(payload: {
    data: T;
    keys: string[];
  }): Partial<T> {
    const { data, keys } = payload;

    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !keys.includes(key))
    ) as Partial<T>;
  }
  static async markLotsAsReserved(
    db: Database,
    lotIds: string[]
  ): Promise<void> {
    if (!lotIds || lotIds.length === 0) {
      throw new Error("No lot IDs provided to mark as reserved.");
    }

    // Build placeholders like (?, ?, ?)
    const placeholders = lotIds.map(() => "?").join(", ");

    await db.run(
      `UPDATE Lot 
       SET status = 'reserved' 
       WHERE _id IN (${placeholders})`,
      lotIds
    );
  }
}
