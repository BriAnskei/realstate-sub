import express from "express";
import { Database } from "sqlite";
import { ContractRepository } from "../repo/contractRepository";
import { ContractController } from "../controllers/contractController";
import { asyncHandler } from "../utils/asyncHandler";
import { UploadService } from "../service/UploadService";

export function createContractRouter(db: Database) {
  const contractRouter = express.Router();
  const contractRepo = new ContractRepository(db);
  const contractController = new ContractController(contractRepo);

  // need to use it here to save the pdf file
  contractRouter.post(
    "/add",
    asyncHandler(contractController.addContract, "addContract")
  );

  contractRouter.post(
    "/upload/pdf",
    asyncHandler(contractController.uploadContractPdf, "uploadContractPdf")
  );

  contractRouter.get(
    "/get/all",
    asyncHandler(contractController.fetchAllContracts, "fetchAllContracts")
  );

  contractRouter.get(
    "/search",
    asyncHandler(contractController.searchContract, "searchContract")
  );

  contractRouter.post(
    "/generate",
    asyncHandler(contractController.getGeneratedPdf, "getGeneratedPdf")
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
