import { Database } from "sqlite";
import { ApplicationType } from "../model/applicationModel";
import { AppController } from "../controllers/appController";

export class ApplicationRepo {
  constructor(private db: Database) {}

  async create(application: ApplicationType): Promise<ApplicationType | null> {
    const res = await this.db.run(
      `
      INSERT INTO Application (
         landId, landName, clientName, lotIds, clientId, agentDealerId, otherAgentIds, appointmentDate, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        application.landId ?? null,
        application.landName ?? null,
        application.clientName ?? null,
        application.lotIds ? JSON.stringify(application.lotIds) : null,
        application.clientId ?? null,
        application.agentDealerId ?? null,
        application.otherAgentIds
          ? JSON.stringify(application.otherAgentIds)
          : null,
        application.appointmentDate ?? null,
        application.status ?? "pending", // default status
      ]
    );

    const appId = res.lastID!;

    const createdApp = await this.findById(appId!);

    return createdApp;
  }

  async update(payload: {
    applicationId: string;
    data: Partial<AppController>;
  }): Promise<boolean> {
    const { applicationId, data } = payload;

    // Remove undefined fields
    const entries = Object.entries(data).filter(
      ([key]) => key !== "_id" && key !== "createdAt"
    );

    if (entries.length === 0) {
      throw new Error("No fields provided for update");
    }

    // Build SET clause dynamically
    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");

    const values = entries.map(([_, value]) => {
      // Convert arrays to JSON string since SQLite doesn't support arrays directly
      if (Array.isArray(value)) return JSON.stringify(value);
      return value;
    });

    await this.db.run(`UPDATE Application SET ${setClause} WHERE _id = ?`, [
      ...values,
      applicationId,
    ]);
    return true;
  }

  /**
   *
   * @param agentId
   * @returns returns all the applications, by dealer or other agents that are part of the specific application
   */
  async getApplicationsByAgent(agentId: string): Promise<ApplicationType[]> {
    const query = `
    SELECT *
    FROM Application
    WHERE agentDealerId = ?
       OR EXISTS (
          SELECT 1
          FROM json_each(Application.otherAgentIds)
          WHERE json_each.value = CAST(? AS INTEGER)
          OR json_each.value = CAST(? AS TEXT)
       )
  `;
    return this.db.all<ApplicationType[]>(query, [agentId, agentId, agentId]);
  }

  /**
   *
   * @param agentId
   * @param filters
   * @returns returns the filtered application of corresponding agents or all applications
   */
  async getFilteredData(payload: {
    agentId?: string;
    filters: { search?: string; status?: string };
  }): Promise<ApplicationType[]> {
    const { agentId, filters } = payload;
    console.log("payload: ", payload);

    // Base query - no agent filter initially
    let query = `SELECT * FROM Application WHERE 1=1`;
    const params: any[] = [];

    // Add agent filter only if agentId is provided
    if (agentId) {
      query += ` AND (
        agentDealerId = ?
        OR EXISTS (
          SELECT 1
          FROM json_each(Application.otherAgentIds)
          WHERE json_each.value = CAST(? AS INTEGER)
          OR json_each.value = CAST(? AS TEXT)
        )
      )`;
      params.push(agentId, agentId, agentId);
    }

    // Add status filter
    if (filters.status) {
      query += ` AND status = ?`;
      params.push(filters.status);
    }

    // Add search filter (example: search in landName or clientName)
    if (filters.search) {
      query += ` AND (landName LIKE ? OR clientName LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY createdAt DESC`;

    return this.db.all<ApplicationType[]>(query, params);
  }

  /**
   *
   * @param id
   * @returns return specific application based on id
   */
  async findById(id: number): Promise<ApplicationType | null> {
    const row = await this.db.get<ApplicationType>(
      `SELECT * FROM Application WHERE _id = ?`,
      [id]
    );

    return row ?? null;
  }

  async getAll(): Promise<ApplicationType[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM Application`);

    return rows.map((row) => ({
      ...row,
      lotIds: row.lotIds ? JSON.parse(row.lotIds) : [],
      otherAgentIds: row.otherAgentIds ? JSON.parse(row.otherAgentIds) : [],
    }));
  }

  async updateStatus(payload: {
    applicationId: number;
    newStatus: string;
  }): Promise<boolean> {
    const { applicationId, newStatus } = payload;
    await this.db.run(
      `
    UPDATE Application
    SET status = ?
    WHERE _id = ?;
  `,
      [newStatus, applicationId]
    );

    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.run(`DELETE FROM Application WHERE _id = ? `, [id]);
    return true;
  }
}
