// lotRouter.ts
import express from "express";
import { Database } from "sqlite";
import { LotController } from "../controllers/lotController";
import { LotRepository } from "../repo/lotRepository";
import { asyncHandler } from "../utils/asyncHandler";

export function createLotRouter(db: Database) {
  const lotRouter = express.Router();
  const lotRepo = new LotRepository(db);
  const lotController = new LotController(lotRepo);

  lotRouter.post(
    "/find/:id",
    asyncHandler(lotController.finLotById, "finLotById")
  );

  lotRouter.post(
    "/getLotsByIds",
    asyncHandler(lotController.getLotsByIds, "getLotsByIds")
  );

  lotRouter.post(
    "/find/landId/:landId",
    asyncHandler(lotController.findLotsByLandId, "findLotsByLandId")
  );

  lotRouter.get("/lots", asyncHandler(lotController.getLots, "getLots"));

  lotRouter.get(
    "/lots/search",
    asyncHandler(lotController.searchLotsByLandName, "searchLotsByLandName")
  );

  lotRouter.post("/update/:_id", asyncHandler(lotController.update, "update"));

  lotRouter.post(
    "/lots/:id",
    asyncHandler(lotController.deleteLot, "deleteLot")
  );

  return lotRouter;
}
