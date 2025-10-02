import { Database } from "sqlite";
import { ApplicationType } from "../model/applicationModel";

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

    console.log("creation result: ", createdApp);

    return createdApp;
  }

  // Find by ID
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
  }): Promise<void> {
    const { applicationId, newStatus } = payload;
    await this.db.run(
      `
    UPDATE Application
    SET status = ?
    WHERE _id = ?;
  `,
      [newStatus, applicationId]
    );
  }
}
