// src/repository/LandRepository.ts
import { Database } from "sqlite";
import { Land } from "../model/landModel";
import { Lot } from "../model/lotModel";

export class LandRepository {
  constructor(private db: Database) {}

  async createLandWithLots(payload: {
    land: Land;
    lots: Lot[];
  }): Promise<{ land: Land; lots: Lot[] }> {
    const { land, lots } = payload;

    await this.db.exec("BEGIN TRANSACTION");

    try {
      // Insert Land
      const landResult = await this.db.run(
        `INSERT INTO Land (name, location, totalArea, totalLots, available, lotsSold)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          land.name,
          land.location,
          land.totalArea,
          land.totalLots,
          land.available,
          land.lotsSold,
        ]
      );

      const landId = landResult.lastID!;
      const createdLand = await this.findById(landId);

      // Insert Lots (linked to landId)
      const stmt = await this.db.prepare(`
      INSERT INTO Lot (
        landId, blockNumber, lotNumber, lotSize, pricePerSqm,
        totalAmount, lotType, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

      for (const lot of lots) {
        await stmt.run([
          landId,
          lot.blockNumber,
          lot.lotNumber,
          lot.lotSize,
          lot.pricePerSqm,
          lot.totalAmount,
          lot.lotType,
          lot.status,
        ]);
      }

      await stmt.finalize();

      await this.db.exec("COMMIT");

      const createdLots = await this.db.all<Lot[]>(
        `SELECT * FROM Lot WHERE landId = ?`,
        [landId]
      );

      return { land: createdLand!, lots: createdLots };
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }

  async findByName(name: string): Promise<Land[]> {
    return this.db.all<Land[]>(
      `SELECT * FROM Land WHERE name LIKE ? COLLATE NOCASE`,
      [`%${name}%`]
    );
  }

  async findById(id: number): Promise<Land | null> {
    const row = await this.db.get<Land>(`SELECT * FROM Land WHERE _id = ?`, [
      id,
    ]);
    return row ?? null;
  }

  async findAll(): Promise<Land[]> {
    return this.db.all<Land[]>(`SELECT * FROM Land`);
  }

  async update(id: number, land: Partial<Land>): Promise<Land | null> {
    const fields = Object.keys(land);
    const values = Object.values(land);

    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((f) => `${f} = ?`).join(", ");

    console.log(`UPDATE Land SET ${setClause} WHERE _id = ?`, [...values, id]);

    await this.db.run(`UPDATE Land SET ${setClause} WHERE _id = ?`, [
      ...values,
      id,
    ]);

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.run(`DELETE FROM Land WHERE _id = ?`, [id]);
    return result.changes! > 0;
  }
}
