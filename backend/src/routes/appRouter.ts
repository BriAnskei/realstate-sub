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
})();

export default applicationRouter;
