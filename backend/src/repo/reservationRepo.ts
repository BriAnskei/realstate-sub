import { Database } from "sqlite";
import { ReserveType } from "../model/reserationModel";
import { ApplicationType } from "../model/applicationModel";
import { AppService } from "../service/applictionService";
import { LandService } from "../service/landService";
import { LotService } from "../service/lot.service";

export class ReserveRepo {
  constructor(private db: Database) {}

  async create(payload: {
    reservation: ReserveType;
    application: ApplicationType;
  }): Promise<{
    success: boolean;
    message?: string;
    reservation?: ReserveType;
    application?: ApplicationType;
  }> {
    try {
      const { reservation, application } = payload;
      await this.db.exec("BEGIN TRANSACTION");

      // this function is resevation manual add, thats why we need to create applicaiton. we need to create- application first to get the ferign key
      const applcationRes = await AppService.createApplicaitonByEmployee(
        this.db,
        application
      );
      if (!applcationRes.success) {
        await this.db.exec("ROLLBACK");
        return {
          success: false,
          message: applcationRes.message,
        };
      }

      const applicationId = applcationRes.application?._id!;

      const res = await this.db.run(
        `
    INSERT INTO Reservation (
      applicationId, clientName, status, appointmentDate, notes
    )
    VALUES (?, ?, ?, ?, ?)
    `,
        [
          applicationId,
          reservation.clientName,
          reservation.status ?? "pending",
          reservation.appointmentDate ?? null,
          reservation.notes ?? null,
        ]
      );

      await this.processApplicationLandAndLots(applcationRes.application!);

      const reservationData = await this.findById(res.lastID!);

      await this.db.exec("COMMIT");

      return {
        success: true,
        reservation: reservationData!,
        application: applcationRes.application!,
      };
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }

  /**
   *
   * @description emplyee mandual reservation
   */
  private async processApplicationLandAndLots(application: ApplicationType) {
    await LandService.setSoldLots(this.db, {
      landID: application.landId,
      totalSoldLots: application.lotIds.length,
    });

    await LotService.setLotsStatus(this.db, {
      lotIds: application.lotIds,
      status: "reserved",
    });
  }

  async findById(id: number): Promise<ReserveType | undefined> {
    const row = await this.db.get<ReserveType>(
      `SELECT * FROM Reservation WHERE _id = ?`,
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      applicationId: row.applicationId
        ? JSON.parse(row.applicationId as unknown as string)
        : [],
    };
  }

  /**
   * @description this function is for reservation that will have cancelled/no show status
   */
  async rejectReservation(payload: {
    reservation: ReserveType;
    status: string;
    notes?: string;
  }): Promise<{ success: boolean; application: ApplicationType }> {
    const { reservation, status, notes } = payload;
    try {
      console.log("recieved paylaod: ", payload);

      await this.db.exec("BEGIN TRANSACTION");
      // update reservation status-cancelle/no-show
      await this.changeReservationStatus(reservation._id!, status);

      // manage application, land, lots
      const application = await AppService.manageReserveAppRejection(this.db, {
        applicationId: reservation.applicationId,
        status,
        notes,
      });
      await this.db.exec("COMMIT");
      return { success: true, application };
    } catch (error) {
      await this.db.exec("ROLLBACK");
      console.log("Error in rejectReservation");
      throw error;
    }
  }

  private async changeReservationStatus(
    reservationId: number,
    status: string
  ): Promise<void> {
    try {
      await this.db.run(
        `
      UPDATE Reservation
      SET status = ?
      WHERE _id = ?
      `,
        [status, reservationId]
      );
    } catch (error) {
      throw error;
    }
  }

  async filterReservation(payload: {
    query?: string;
    status?: string;
  }): Promise<ReserveType[]> {
    const { query, status } = payload;

    let sql = `
    SELECT * FROM Reservation
    WHERE 1 = 1
  `;
    const params: any[] = [];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (query) {
      sql += ` AND LOWER(clientName) LIKE LOWER(?)`;
      params.push(`%${query}%`);
    }

    sql += ` ORDER BY createdAt DESC`;

    const rows = await this.db.all(sql, params);
    return rows;
  }

  async findAll(): Promise<ReserveType[]> {
    const rows = await this.db.all<ReserveType[]>(
      `SELECT * FROM Reservation ORDER BY createdat DESC`
    );

    return rows.map((row) => ({
      ...row,
      applicationId: row.applicationId
        ? JSON.parse(row.applicationId as unknown as string)
        : [],
    }));
  }

  async update(
    id: number,
    updates: Partial<Omit<ReserveType, "id" | "createdAt">>
  ): Promise<ReserveType | undefined> {
    const exsitingReserve = await this.findById(id);
    if (!exsitingReserve) {
      return undefined;
    }

    const setClause: string[] = [];
    const values: any[] = [];

    if (updates.applicationId !== undefined) {
      setClause.push("applicationId = ?");
      values.push(
        updates.applicationId ? JSON.stringify(updates.applicationId) : null
      );
    }

    if (updates.clientName !== undefined) {
      setClause.push("clientName = ?");
      values.push(updates.clientName);
    }

    if (updates.status !== undefined) {
      setClause.push("status = ?");
      values.push(updates.status);
    }

    if (updates.notes !== undefined) {
      setClause.push("notes = ?");
      values.push(updates.notes);
    }

    if (setClause.length === 0) {
      return exsitingReserve;
    }

    values.push(id);

    await this.db.run(
      `UPDATE Reservation SET ${setClause.join(", ")} WHERE reserveId = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.run(
      `DELETE FROM Reservation WHERE reserveId = ?`,
      [id]
    );

    return result.changes !== undefined && result.changes > 0;
  }
}
