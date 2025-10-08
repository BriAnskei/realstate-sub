import { Database } from "sqlite";
import { ApplicationType } from "../model/applicationModel";
import { AppController } from "../controllers/appController";
import { ReservationService } from "../service/reseervationService";
import { LotService } from "../service/lot.service";
import { ReserveType } from "../model/reserationModel";
import { LandService } from "../service/landService";
import { AppService } from "../service/applictionService";

export class ApplicationRepo {
  constructor(private db: Database) {}

  async create(application: ApplicationType): Promise<{
    success: boolean;
    message?: string;
    application?: ApplicationType;
  }> {
    // check if clienAppliction exist(landIdd, appointment)
    const doesApplicationApointmentExist =
      await AppService.findClientPendingAppIfItExist(this.db, application);

    if (doesApplicationApointmentExist) {
      return {
        success: false,
        message:
          "A record with the specified land ID, client ID, and appointment date already exists in the system. Please update the existing application if modifications are required.",
      };
    }

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

    const createdApp = await AppService.findById(this.db, appId!);

    return { success: true, application: createdApp! };
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
   * @param payload
   * @returns returns success if any of the transaction passed, if the status if  approved, returns   the reservations  data
   */
  async updateStatus(payload: {
    applicationId: string;
    status: "approved" | "rejected";
    note?: string;
    application: ApplicationType;
  }): Promise<{
    success: boolean;
    message?: string;
    reservation?: ReserveType;
  }> {
    const { status, note, application, applicationId } = payload;

    let reservationData: ReserveType | undefined = undefined; // this variable will only be field if the application is approve
    // here we need to return the reservaiton data after approval tracnsaction

    if (status === "rejected") {
      await this.db.run(
        `
      UPDATE Application
      SET status = 'rejected', rejectionNote = ?
      WHERE _id = ?
    `,
        [note, applicationId]
      );
    } else if (status === "approved") {
      // if application is approvedd we can expect that  the clientName or note will be field
      const response = await this.proccessApprovedApplication({
        application,
        clientName: application.clientName,
        note,
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      reservationData = response.reservation;
    } else {
      // For other status updates, just update the status
      await this.db.run(
        `
      UPDATE Application
      SET status = ?
      WHERE _id = ?
    `,
        [status, applicationId]
      );
    }

    return {
      success: true,
      ...(payload.status === "approved" && { reservation: reservationData }),
    };
  }

  private async proccessApprovedApplication(payload: {
    application: ApplicationType;
    clientName: string;
    note?: string;
  }) {
    const { application, clientName, note } = payload;
    const applicationId = application._id!;

    try {
      await this.db.exec("BEGIN TRANSACTION");
      await this.db.run(
        `
      UPDATE Application 
      SET status = 'approved', rejectionNote = NULL 
      WHERE _id = ?
    `,
        [applicationId]
      );

      await this.processSelectedLotsForApproval(application);

      const response = await ReservationService.addReservation(this.db, {
        application,
        clientName,
        note,
      });

      await this.db.exec("COMMIT");
      return response;
    } catch (error) {
      await this.db.exec("ROLLBACK");
      return {
        success: false,
        message: "failed on approving application" + error,
      };
    }
  }

  private async processSelectedLotsForApproval(application: ApplicationType) {
    await LandService.setSoldLots(this.db, {
      landID: application.landId,
      totalSoldLots: application.lotIds.length,
    });
    await LotService.setLotsStatus(this.db, {
      lotIds: application.lotIds,
      status: "reserved",
    });
  }

  /**
   *
   * @returns return  all the applicaiton  with status of pending only  used for employee view.
   */
  async getAll(): Promise<ApplicationType[]> {
    const rows = await this.db.all<any[]>(
      `SELECT * FROM Application ORDER BY appointmentDate DESC`
    );

    return rows.map((row) => ({
      ...row,
      lotIds: row.lotIds ? JSON.parse(row.lotIds) : [],
      otherAgentIds: row.otherAgentIds ? JSON.parse(row.otherAgentIds) : [],
    }));
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
   * @returns returns the filtered application of corresponding agent(if it exist)s or all applications
   * this fucntion is useable for employee for filtering
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
    if (agentId && agentId !== undefined) {
      console.log("agnet iD, ", agentId);
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

  async getRejectedApplicationsByAgentId(
    agentId: string
  ): Promise<ApplicationType[]> {
    const query = `
    SELECT *
    FROM Application
    WHERE status = 'rejected'
      AND (
        agentDealerId = ?
        OR EXISTS (
          SELECT 1
          FROM json_each(Application.otherAgentIds)
          WHERE json_each.value = CAST(? AS TEXT)
             OR json_each.value = CAST(? AS INTEGER)
        )
      )
    ORDER BY createdAt DESC
  `;

    const rows = await this.db.all(query, [agentId, agentId, agentId]);

    return rows.map((row) => ({
      ...row,
      lotIds: row.lotIds ? JSON.parse(row.lotIds) : [],
      otherAgentIds: row.otherAgentIds ? JSON.parse(row.otherAgentIds) : [],
    }));
  }

  async findById(id: number): Promise<ApplicationType | null> {
    const row = await this.db.get<ApplicationType>(
      `SELECT * FROM Application WHERE _id = ?`,
      [id]
    );

    if (!row) {
      throw new Error("Cannot find application");
    }

    let application: ApplicationType;

    application = {
      ...row,
      lotIds: LotService.parseArrayIfNeeded(row?.lotIds!),
      otherAgentIds: LotService.parseArrayIfNeeded(row?.otherAgentIds!),
    };

    return application ?? null;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.run(`DELETE FROM Application WHERE _id = ? `, [id]);
    return true;
  }
}
