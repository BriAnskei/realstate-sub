import express from "express";
import { initDB } from "../db";
import { ApplicationRepo } from "../repo/appRepository";
import { AppController } from "../controllers/appController";

const applicationRouter = express.Router();

(async () => {
  const db = await initDB();
  const appRepo = new ApplicationRepo(db);
  const appController = new AppController(appRepo);


  


})();
