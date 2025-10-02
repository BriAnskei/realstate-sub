import { Database } from "sqlite";
import { Lot } from "../model/lotModel";
import { Land } from "../model/landModel";

enum Status {
  available = "available",
  reserved = "reserved",
  sold = "sold",
}

export class LotRepository {
  constructor(private db: Database) {}

  async delete(id: number): Promise<void> {
    await this.db.run(`DELETE FROM Lot WHERE _id = ?`, [id]);
  }

  /**
   * Search lots by land name and/or status.
   *
   * @param payload - The search filters.
   * @param payload.landName - (optional) The name of the land.
   * @param payload.status - (optional) The status of the land.
   * @returns A promise that resolves to an array of Land objects, or null if none found.
   */
  async searchLotsByLandName(payload: {
    landName?: string;
    status?: string;
  }): Promise<Land[] | null> {
    const { landName, status } = payload;

    let query = `
      SELECT Lot.*, Land.name
      FROM Lot
      JOIN Land ON Lot.landId = Land._id
  
    `;

    const params: any[] = [];

    if (landName) {
      query += `WHERE Land.name LIKE ?`;
      params.push(`%${landName}%`);
    }

    if (status) {
      if (landName) {
        query += ` AND Lot.status = ?`;
      } else {
        query += `WHERE Lot.status = ?`;
      }

      params.push(status);
    }

    query += `;`;

    return this.db.all(query, params);
  }

  /**
   *
   * @param id
   * @returns A promise Lot
   */
  async findById(id: number): Promise<Lot | null> {
    const row = await this.db.get<Lot>(`SELECT * FROM Lot WHERE _id = ?`, [id]);
    return row ?? null;
  }

  async findLotsByLandId(id: number): Promise<Lot[] | null> {
    const rows = await this.db.all<Lot[]>(
      `SELECT * FROM Lot WHERE landId = ?`,
      [id]
    );
    return rows ?? null;
  }

  async getLotsByIds(lotIds: number[]): Promise<Lot[]> {
    if (lotIds.length === 0) return [];

    console.log("data recieved: ", lotIds);

    // Create placeholders (?, ?, ?) based on lotIds length
    const placeholders = lotIds.map(() => "?").join(", ");

    const query = `
      SELECT * FROM Lot
      WHERE _id IN (${placeholders})
    `;

    const rows = await this.db.all<Lot[]>(query, lotIds);
    return rows;
  }

  async findAllPaginated(payload: {
    cursor?: string;
    filterStatus?: string;
    limit?: number;
  }): Promise<{ lots: Lot[]; hasMore: boolean }> {
    const { cursor, limit = 1000 } = payload;

    let query = `
      SELECT Lot.*, Land.name
      FROM Lot
      JOIN Land ON Lot.landId = Land._id
    `;

    const params: any[] = [];

    if (cursor) {
      query += `Lot.createdAt < ?`;

      params.push(cursor);
    }

    query += `
      ORDER BY Lot.createdAt DESC
      LIMIT ?
    `;
    params.push(limit + 1);

    const lots = await this.db.all<Lot[]>(query, params);

    let hasMore = false;
    if (lots.length > limit) {
      lots.pop();
      hasMore = true;
    }

    return { lots, hasMore };
  }

  async update(payload: { _id: number; lot: Partial<Lot> }): Promise<void> {
    const { _id, lot } = payload;

    // filter primary props
    const fields = Object.keys(lot)
      .filter((key) => key !== "_id" && key !== "createdAt")
      .map((key) => `${key} = ?`);

    const values = Object.values(lot);

    // no value to change
    if (fields.length === 0) return;

    await this.db.run(`UPDATE Lot SET  ${fields.join(", ")} WHERE _id = ?`, [
      ...values,
      _id,
    ]);
  }
}
