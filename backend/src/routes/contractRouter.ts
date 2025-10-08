import express from "express";
import { Database } from "sqlite";
import { ContractRepository } from "../repo/contractRepository";
import { ContractController } from "../controllers/contractController";
import { asyncHandler } from "../utils/asyncHandler";

export function createContractRouter(db: Database) {
  const contractRouter = express.Router();
  const contractRepo = new ContractRepository(db);
  const contractController = new ContractController(contractRepo);

  contractRouter.post(
    "/add",
    asyncHandler(contractController.addContract, "addContract")
  );

  contractRouter.get(
    "/get/all",
    asyncHandler(contractController.fetchAllContracts, "fetchAllContracts")
  );

  contractRouter.get(
    "/get/by-agent/:agentId",
    asyncHandler(
      contractController.fetchContractsByAgentId,
      "fetchContractsByAgentId"
    )
  );

  contractRouter.get(
    "/get/by-id/:_id",
    asyncHandler(contractController.getContractById, "getContractById")
  );

  return contractRouter;
}
