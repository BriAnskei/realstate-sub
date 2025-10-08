import { ContractType } from "../model/contractModel";
import { ContractRepository } from "../repo/contractRepository";
import { Request, Response } from "express";

export class ContractController {
  constructor(private contractRepo: ContractRepository) {}

  /**
   * Add a new contract
   */
  addContract = async (req: Request, res: Response): Promise<void> => {
    try {
      const contractData: Omit<ContractType, "_id" | "createdAt"> = req.body;

      await this.contractRepo.addContract(contractData);

      res.json({
        success: true,
        message: "Contract created successfully.",
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

  /**
   * Fetch all contracts by a specific agent ID
   */
  fetchContractsByAgentId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const agentId = req.params.agentId || req.body.agentId;

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

      const contract = await this.contractRepo.findById(_id);

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
