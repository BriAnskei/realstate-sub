import { Database } from "sqlite";
import { ApplicationType } from "../model/applicationModel";

export class ApplicationRepo {
  constructor(private db: Database) {}

  // Create
  async create(
    application: ApplicationType
  ): Promise<ApplicationType | undefined> {
    const appResult = await this.db.run(
      `
      INSERT INTO Application (
        _id, landId, landName, clientName, lotIds, clientId, agentDealer, otherAgent, appointmentDate, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        application.landdId ?? null,
        application.landName ?? null,
        application.clientName ?? null,
        application.lotIds ? JSON.stringify(application.lotIds) : null,
        application.clientId ?? null,
        application.agentDealer
          ? JSON.stringify(application.agentDealer)
          : null,
        application.otherAgent ? JSON.stringify(application.otherAgent) : null,
        application.appointmentDate ?? null,
        application.status ?? "pending", // default status
      ]
    );

    const appId = appResult.lastID!;
    const createdApp = await this.findById(appId);

    console.log("creation result: ", createdApp);

    return createdApp;
  }

  // Find by ID
  async findById(id: number): Promise<ApplicationType | undefined> {
    const row = await this.db.get<ApplicationType>(
      `SELECT * FROM Application WHERE _id = ?`,
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      lotIds: row.lotIds ? JSON.parse(row.lotIds as unknown as string) : [],
      agentDealer: row.agentDealer
        ? JSON.parse(row.agentDealer as unknown as string)
        : [],
      otherAgent: row.otherAgent
        ? JSON.parse(row.otherAgent as unknown as string)
        : [],
    };
  }

  // Find all
  async findAll(status?: string): Promise<ApplicationType[]> {
    const rows = status
      ? await this.db.all<ApplicationType[]>(
          `SELECT * FROM Application WHERE status = ? ORDER BY createdAt DESC`,
          [status]
        )
      : await this.db.all<ApplicationType[]>(
          `SELECT * FROM Application ORDER BY createdAt DESC`
        );

    return rows.map((row) => ({
      ...row,
      lotIds: row.lotIds ? JSON.parse(row.lotIds as unknown as string) : [],
      agentDealer: row.agentDealer
        ? JSON.parse(row.agentDealer as unknown as string)
        : [],
      otherAgent: row.otherAgent
        ? JSON.parse(row.otherAgent as unknown as string)
        : [],
    }));
  }

  // Update
  async update(
    id: string,
    updates: Partial<ApplicationType>
  ): Promise<boolean> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => {
      const val = (updates as any)[f];
      return Array.isArray(val) ? JSON.stringify(val) : val;
    });

    const result = await this.db.run(
      `UPDATE Application SET ${setClause} WHERE _id = ?`,
      [...values, id]
    );

    return result.changes > 0;
  }

  // Delete
  async delete(id: string): Promise<boolean> {
    const result = await this.db.run(`DELETE FROM Application WHERE _id = ?`, [
      id,
    ]);
    return result.changes > 0;
  }
}
