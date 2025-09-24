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
    await this.db.exec("BEGIN TRANSACTION");

    try {
      const lotData = await this.findById(id);

      if (!lotData)
        throw new Error("Error deleting lot, lot does not exist in DB");

      await this.db.run(`DELETE FROM Lot WHERE _id = ?`, [id]);

      // Case where the lot is marked as Sold(reserve/sold)
      if (
        lotData.status === Status.reserved ||
        lotData.status === Status.sold
      ) {
        await this.db.run(
          `UPDATE Land SET lotsSold = lotsSold - 1 WHERE _id = ?`,
          [lotData.landId]
        );
      } else if (lotData.status === Status.available) {
        await this.db.run(
          `UPDATE Land SET available = available - 1 WHERE _id = ?`,
          [lotData.landId]
        );
      }

      await this.db.run(
        `UPDATE Land SET totalLots = totalLots - 1 WHERE _id = ?`,
        [lotData.landId]
      );

      await this.db.exec(`COMMIT`);
    } catch (error) {
      await this.db.exec("ROOLBACK");
      throw error;
    }
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
