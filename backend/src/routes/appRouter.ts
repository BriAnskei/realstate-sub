import express from "express";
import { initDB } from "../db";
import { ApplicationRepo } from "../repo/appRepository";
import { AppController } from "../controllers/appController";
import { asyncHandler } from "../utils/asyncHandler";

const applicationRouter = express.Router();

(async () => {
  const db = await initDB();
  const appRepo = new ApplicationRepo(db);
  const appController = new AppController(appRepo);

  applicationRouter.post(
    "/add",
    asyncHandler(appController.addNewApp, "addNewApp")
  );

  applicationRouter.get(
    "/get/all",
    asyncHandler(appController.fetchAllApp, "fetchAllApp")
  );

  applicationRouter.get(
    "/filter/by-agents/:_id",
    asyncHandler(
      appController.getFilteredAppsByAgents,
      "getFilteredAppsByAgents"
    )
  );

  applicationRouter.get(
    "/get/by-agents/:_id",
    asyncHandler(appController.getAppByAgent, "getAppByAgent")
  );

  applicationRouter.post(
    "/update/:_id",
    asyncHandler(appController.updateStats, "updateStats")
  );

  applicationRouter.post(
    "/delete/:_id",
    asyncHandler(appController.delete, "delete")
  );
})();

export default applicationRouter;
