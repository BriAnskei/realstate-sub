import { Database } from "sqlite";
import { Lot } from "../model/lotModel";
import { Land } from "../model/landModel";

export class LotRepository {
  constructor(private db: Database) {}

  async delete(id: number): Promise<void> {
    await this.db.run(`DELETE FROM Lot WHERE _id = ?`, [id]);
  }

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

  async findAllPaginated(payload: {
    cursor?: string;
    filterStatus?: string;
    limit?: number;
  }): Promise<{ lots: Lot[]; hasMore: boolean }> {
    const { cursor, limit = 10 } = payload;

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
}
