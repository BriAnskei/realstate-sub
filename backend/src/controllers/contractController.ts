import { ContractType } from "../model/contractModel";
import { ContractRepository } from "../repo/contractRepository";
import { Request, Response } from "express";
import { PdfService } from "../service/pdfGenerator";

export class ContractController {
  constructor(private contractRepo: ContractRepository) {}

  /**
   * Add a new contract
   */
  addContract = async (req: Request, res: Response): Promise<void> => {
    try {
      const contractData: Omit<ContractType, "_id" | "createdAt"> = req.body;

      const contract = await this.contractRepo.addContract(contractData);

      res.json({
        success: true,
        message: "Contract created successfully.",
        contract,
      });
    } catch (error: any) {
      console.error("Error creating contract:", error);
      res.json({
        success: false,
        message: "Failed to create contract.",
        error: error.message,
      });
    }
  };

  uploadContractPdf = async (req: Request, res: Response): Promise<void> => {
    const contract = req.body.contract as ContractType;

    const repoResponse = await this.contractRepo.handleContractPdfFileUploader(
      contract
    );

    const newContract: ContractType = {
      ...contract,
      contractPDF: repoResponse.fileName,
    };
    res.json({
      contract: newContract,
      application: repoResponse.application,
      reservation: repoResponse.reservation,
    });
  };

  /**
   * Fetch all contracts
   */
  fetchAllContracts = async (_: Request, res: Response): Promise<void> => {
    try {
      const contracts = await this.contractRepo.fetchAllContracts();
      res.json({ success: true, contracts });
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      res.json({
        success: false,
        message: "Failed to fetch contracts.",
        error: error.message,
      });
    }
  };

  getGeneratedPdf = async (req: Request, res: Response): Promise<void> => {
    const { clientId, applicationId, term } = req.body;

    const genratedPdf = await this.contractRepo.getGeneratedPdf({
      clientId,
      applicationId,
      term,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${applicationId}.pdf`
    );
    res.send(genratedPdf);
  };

  fetchContractsByAgentId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const agentId = req.params.agentId || req.body.agentId;
      console.log("Fetching contract of this agent: ", agentId);
      if (!agentId) {
        res.json({
          success: false,
          message: "Agent ID is required.",
        });
        return;
      }

      const contracts = await this.contractRepo.fetchContractsByAgentId(
        agentId
      );

      res.json({
        success: true,
        contracts,
      });
    } catch (error: any) {
      console.error("Error fetching contracts by agent ID:", error);
      res.json({
        success: false,
        message: "Failed to fetch contracts for this agent.",
        error: error.message,
      });
    }
  };

  /**
   * Find a contract by ID
   */
  getContractById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.params;

      if (!_id) {
        res.json({
          success: false,
          message: "Contract ID is required.",
        });
        return;
      }

      const contract = await this.contractRepo.findById(parseInt(_id, 10));

      if (!contract) {
        res.json({
          success: false,
          message: "Contract not found.",
        });
        return;
      }

      res.json({
        success: true,
        contract,
      });
    } catch (error: any) {
      console.error("Error fetching contract by ID:", error);
      res.json({
        success: false,
        message: "Failed to fetch contract.",
        error: error.message,
      });
    }
  };
}
