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

  static async findLandById(
    db: Database,
    landID: string
  ): Promise<Land | undefined> {
    return await db.get("SELECT * FROM Land WHERE _id = ?", [landID]);
  }
}
