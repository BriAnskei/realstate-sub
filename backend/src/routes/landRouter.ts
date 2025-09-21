import { Router } from "express";
import { initDB } from "../db";
import { LandRepository } from "../repo/landRepository";
import { LandController } from "../controllers/landController";
import { asyncHandler } from "../utils/asyncHandler";

const landRouter = Router();

(async () => {
  const db = await initDB();
  const repo = new LandRepository(db);
  const controller = new LandController(repo);

  landRouter.get("/get", asyncHandler(controller.getAllLands, "getAllLands"));
  landRouter.post("/add", asyncHandler(controller.newLandAndLots, "createNew"));
  landRouter.post(
    "/update/:_id",
    asyncHandler(controller.updateLand, "updateLand")
  );
  landRouter.get("/find/:_id", asyncHandler(controller.findOne, "findOne"));
  landRouter.post("/delete", asyncHandler(controller.delete, "delete"));
})();

export default landRouter;
