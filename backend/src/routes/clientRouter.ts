import express from "express";
import { ClientRepository } from "../repo/clientRepository";
import { ClientController } from "../controllers/clientController";
import { asyncHandler } from "../utils/asyncHandler";
import { UploadService } from "../service/UploadService";
import { Database } from "sqlite";

export function createClientRouter(db: Database) {
  const clientRouter = express.Router();
  const clientRepo = new ClientRepository(db);
  const clientController = new ClientController(clientRepo);
  console.log("initializing client db", db);

  clientRouter.post(
    "/create",
    UploadService.clients.temp,
    asyncHandler(clientController.create.bind(clientController), "createClient")
  );

  clientRouter.get(
    "/fetch",
    asyncHandler(clientController.getClients, "getClients")
  );

  clientRouter.get(
    "/find/:id",
    asyncHandler(clientController.getClientById, "getClientById")
  );

  clientRouter.put(
    "/update/:id",
    asyncHandler(clientController.updateClient, "updateClient")
  );

  clientRouter.delete(
    "/delete/:id",
    asyncHandler(clientController.deleteClient, "deleteClient")
  );

  clientRouter.get("/search", asyncHandler(clientController.search, "search"));
  return clientRouter;
}
