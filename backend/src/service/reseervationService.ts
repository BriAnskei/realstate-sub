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
}
