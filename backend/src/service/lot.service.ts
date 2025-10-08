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
  static async setLotsStatus(
    db: Database,
    payload: {
      lotIds: string[];
      status: string;
    }
  ): Promise<void> {
    try {
      const { lotIds, status } = payload;

      if (!lotIds || lotIds.length === 0) {
        throw new Error("No lot IDs provided to update status.");
      }
      const placeholders = lotIds.map(() => "?").join(", ");

      const params = [status, ...lotIds];

      await db.run(
        `
    UPDATE Lot
    SET status = ?
    WHERE _id IN (${placeholders})
    `,
        params
      );
    } catch (error) {
      console.error("Error in setLotsStatus", error);
      throw error;
    }
  }
}
