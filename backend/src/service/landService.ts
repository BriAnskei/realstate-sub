import { Database } from "sqlite";
import { Land } from "../model/landModel";
import { ReservationService } from "./reseervationService";

export class LandService {
  // used for reservation or on contract
  static async setSoldLots(
    db: Database,
    payload: { landID: string; totalSoldLots: number }
  ) {
    const { landID, totalSoldLots } = payload;

    const landData = await LandService.findLandById(db, landID);
    if (!landData) {
      throw new Error(`Land with ID ${landID} not found`);
    }

    const updatedLotsSold = (landData.lotsSold ?? 0) + totalSoldLots;

    const newAvailable = landData.totalLots - updatedLotsSold;

    await db.run(
      `
    UPDATE Land
    SET lotsSold = ?, available = ?
    WHERE _id = ?
    `,
      [updatedLotsSold, newAvailable, landID]
    );
  }

  /**
   * @description this function is used for reservation rejection(no show/cancelled).
   * this will redo the sold lots by rejection resertvaion-application
   */
  static async redoSoldLotsAvailability(
    db: Database,
    payload: {
      landId: string;
      totalSoldToRedo: number;
    }
  ): Promise<void> {
    try {
      const { landId, totalSoldToRedo } = payload;
      if (!landId) {
        throw new Error("Land ID is required.");
      }

      if (totalSoldToRedo <= 0) {
        throw new Error("Invalid totalSoldToRedo value.");
      }

      await db.run(
        `
      UPDATE Land
      SET 
        available = available + ?,
        lotsSold = lotsSold - ?
      WHERE _id = ?
      `,
        [totalSoldToRedo, totalSoldToRedo, landId]
      );
    } catch (error) {
      console.error("Error in redoSoldLotsAvailability:", error);
      throw error;
    }
  }

  static async findLandById(
    db: Database,
    landID: string
  ): Promise<Land | undefined> {
    return await db.get("SELECT * FROM Land WHERE _id = ?", [landID]);
  }

  static async findById(
    db: Database,
    landId: string
  ): Promise<Land | undefined> {
    return await db.get<Land>(`SELECT * FROM Land WHERE _id = ?`, [landId]);
  }
}
