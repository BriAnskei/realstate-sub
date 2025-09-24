import express from "express";
import { initDB } from "../db";
import { ClientRepository } from "../repo/clientRepository";
import { ClientController } from "../controllers/clientController";
import { asyncHandler } from "../utils/asyncHandler";

const clientRouter = express.Router();

(async () => {
  const db = await initDB();
  const clientRepo = new ClientRepository(db);
  const clientController = new ClientController(clientRepo);

  clientRouter.post("/", asyncHandler(clientController.create, "createClient"));

  clientRouter.get(
    "/",
    asyncHandler(clientController.getClients, "getClients")
  );

  clientRouter.get(
    "/:id",
    asyncHandler(clientController.getClientById, "getClientById")
  );

  clientRouter.put(
    "/:id",
    asyncHandler(clientController.updateClient, "updateClient")
  );

  clientRouter.delete(
    "/:id",
    asyncHandler(clientController.deleteClient, "deleteClient")
  );
})();

export default clientRouter;
