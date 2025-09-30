import express from "express";

import { initDB } from "../db"; // your db init
import { LotController } from "../controllers/lotController";
import { LotRepository } from "../repo/lotRepository";
import { asyncHandler } from "../utils/asyncHandler";

const lotRouter = express.Router();

(async () => {
  const db = await initDB();
  const lotRepo = new LotRepository(db);
  const lotController = new LotController(lotRepo);

  lotRouter.post(
    "/find/:id",
    asyncHandler(lotController.finLotById, "finLotById")
  );

  lotRouter.post(
    "/find/landId/:landId",
    asyncHandler(lotController.findLotsByLandId, "findLotsByLandId")
  );

  lotRouter.post(
    "/lots/:id",
    asyncHandler(lotController.deleteLot, "deleteLot")
  );
  lotRouter.get("/lots", asyncHandler(lotController.getLots, "getLots"));
  lotRouter.get(
    "/lots/search",
    asyncHandler(lotController.searchLotsByLandName, "searchLotsByLandName")
  );
})();

export default lotRouter;
