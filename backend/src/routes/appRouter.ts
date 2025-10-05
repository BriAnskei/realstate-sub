import express from "express";
import { initDB } from "../db";
import { ApplicationRepo } from "../repo/appRepository";
import { AppController } from "../controllers/appController";
import { asyncHandler } from "../utils/asyncHandler";
import { Database } from "sqlite";

export function createApplictionRouter(db: Database) {
  const applicationRouter = express.Router();
  const appRepo = new ApplicationRepo(db);
  const appController = new AppController(appRepo);

  applicationRouter.post(
    "/add",
    asyncHandler(appController.addNewApp, "addNewApp")
  );

  applicationRouter.post(
    "/update/:_id",
    asyncHandler(appController.updateApplication, "updateApplication")
  );

  applicationRouter.get(
    "/get/all",
    asyncHandler(appController.fetchAllApp, "fetchAllApp")
  );

  // Id is for agent, might be optional if the user is employee
  applicationRouter.get(
    "/filter/:_id",
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
    "/status-update/:_id",
    asyncHandler(appController.updateStats, "updateStats")
  );

  applicationRouter.post(
    "/delete/:_id",
    asyncHandler(appController.delete, "delete")
  );

  return applicationRouter;
}
