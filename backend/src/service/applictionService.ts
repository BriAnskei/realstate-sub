import { Database } from "sqlite";
import { ApplicationType } from "../model/applicationModel";
import { ApplicationRepo } from "../repo/appRepository";
import { LotService } from "./lot.service";
import { LandService } from "./landService";

export class AppService {
  static async createApplicaitonByEmployee(
    db: Database,
    application: ApplicationType
  ): Promise<{
    success: boolean;
    message?: string;
    application?: ApplicationType;
  }> {
    // check if clienAppliction exist(landIdd, appointment)
    const doesApplicationApointmentExist =
      await AppService.findClientPendingAppIfItExist(db, application);

    if (doesApplicationApointmentExist) {
      return {
        success: false,
        message:
          "A record with the specified land ID, client ID, and appointment date already exists in the system. Please update the existing application if modifications are required.",
      };
    }

    const res = await db.run(
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
        "approved", //approved for manual add
      ]
    );

    const appId = res.lastID!;

    const createdApp = await AppService.findById(db, appId!);

    return { success: true, application: createdApp! };
  }

  static async findClientPendingAppIfItExist(
    db: Database,
    application: ApplicationType
  ): Promise<boolean> {
    const { clientId, landId, appointmentDate } = application;

    const query = `
    SELECT *
    FROM Application
    WHERE clientId = ?
      AND landId = ?
      AND status = 'pending'
    LIMIT 1
  `;

    return Boolean(await db.get<ApplicationType>(query, [clientId, landId]));
  }

  static async findById(
    db: Database,
    id: number
  ): Promise<ApplicationType | null> {
    const row = await db.get<ApplicationType>(
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

  static async doesClientHasApplication(
    db: Database,
    clientId: string
  ): Promise<boolean> {
    return Boolean(
      await db.all(`SELECT * FROM Application WHERE clientId = ? `, [clientId])
    );
  }

  static async manageReserveAppRejection(
    db: Database,
    payload: { applicationId: number; status: string; notes?: string }
  ): Promise<ApplicationType> {
    try {
      const { applicationId } = payload;
      const application = await AppService.findById(db, applicationId);

      if (!application) throw new Error("Cannot find application");

      // update application status
      await AppService.updateApplicationStatus(db, payload);

      // back to available
      await LotService.setLotsStatus(db, {
        lotIds: application?.lotIds!,
        status: "available",
      });

      await LandService.redoSoldLotsAvailability(db, {
        landId: application?.landId!,
        totalSoldToRedo: application?.lotIds.length!,
      });
      return application;
    } catch (error) {
      console.error("Error in manageReserveAppRejection, ", error);
      throw error;
    }
  }
  static async updateApplicationStatus(
    db: Database,
    {
      applicationId,
      status,
      notes,
    }: { applicationId: number; status: string; notes?: string }
  ) {
    try {
      if (!applicationId || !status) {
        throw new Error("Application ID and status are required.");
      }

      const finalNote = notes ? `${status} - ${notes}` : status;

      await db.run(
        `UPDATE Application 
       SET status = ?, rejectionNote = ? 
       WHERE _id = ?`,
        ["rejected", finalNote, applicationId]
      );
    } catch (error) {
      console.error("Error in updateApplicationStatus:", error);
      throw error;
    }
  }
}
