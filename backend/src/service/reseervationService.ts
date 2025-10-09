import { Database } from "sqlite";
import { ReserveType } from "../model/reserationModel";
import { ApplicationType } from "../model/applicationModel";

export class ReservationService {
  /**
   *
   * @param db
   * @param payload
   * @returns returns the generated reservation
   */
  static async addReservation(
    db: Database,
    payload: {
      application: ApplicationType;
      clientName: string;
      status?: string;
      note?: string;
    }
  ): Promise<{
    success: boolean;
    message?: string;
    reservation?: ReserveType;
  }> {
    const { application, clientName, note = "", status = "pending" } = payload;

    try {
      const { _id, appointmentDate } = application;

      const rows = await db.run(
        `
  INSERT INTO Reservation (applicationId, clientName, status, notes, appointmentDate)
  VALUES (?, ?, ?, ?, ?)
  `,
        [_id, clientName, status, note, appointmentDate]
      );

      const createdRervation = await ReservationService.findReservationById(
        db,
        rows.lastID!
      );

      // SQLite's `run` returns an object with `lastID` (the inserted row’s ID)
      return {
        success: true,
        reservation: createdRervation,
        message: "Reservation successfully created.",
      };
    } catch (error) {
      console.error("Error inserting reservation:", error);
      return {
        success: false,
        message: "Failed to create reservation." + error,
      };
    }
  }

  static async findReservationById(db: Database, id: number) {
    return await db.get(
      `
        SELECT *
        FROM Reservation
        WHERE _id = ?
        `,
      [id]
    );
  }

  static async findReservationByApplicationId(
    db: Database,
    applicationId: string
  ): Promise<ReserveType | null> {
    try {
      const reservation = await db.get(
        `
      SELECT *
      FROM Reservation
      WHERE applicationId = ?
      `,
        [applicationId]
      );

      return reservation || null;
    } catch (error) {
      console.error("Error finding reservation by applicationId:", error);
      throw new Error("Failed to find reservation by applicationId.");
    }
  }

  static async updateReservationStatus(
    db: Database,
    payload: { applicationId: string; status: string }
  ) {
    const { applicationId, status } = payload;

    const reservation = await this.findReservationByApplicationId(
      db,
      applicationId
    );
    if (!reservation)
      throw new Error("Cannot find reservation on appplication Id");

    await db.run(
      `
      UPDATE Reservation SET status = ? WHERE _id = ?
      `,
      [status, reservation._id]
    );
  }
}
