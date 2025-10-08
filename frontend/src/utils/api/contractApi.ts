import { ApplicationType } from "../../store/slices/applicationSlice";
import { ContractType } from "../../store/slices/contractSlice";
import { api } from "./instance";

export class ContractApi {
  constructor() {}

  /**
   * Add a new contract
   */
  addContract = async (payload: Omit<ContractType, "_id" | "createdAt">) => {
    try {
      const res = await api.post("/api/contract/add", payload);
      return res.data;
    } catch (error) {
      console.error("Error in addContract:", error);
      throw error;
    }
  };

  /**
   * Fetch all contracts
   */
  fetchAllContracts = async (): Promise<{
    success: boolean;
    contracts: ContractType[];
  }> => {
    try {
      const res = await api.get("/api/contract/all");
      return res.data;
    } catch (error) {
      console.error("Error in fetchAllContracts:", error);
      throw error;
    }
  };

  /**
   * Generate PDF for a contract
   */
  generateContractPdf = async (payload: {
    clientData: ClientTypes;
    application: ApplicationType;
    term: string;
  }): Promise<Blob> => {
    try {
      const res = await api.post("/api/contract/generate", payload, {
        responseType: "blob", // important to receive binary PDF
      });
      return res.data;
    } catch (error) {
      console.error("Error in generateContractPdf:", error);
      throw error;
    }
  };

  /**
   * Fetch contracts by agent ID
   */
  fetchContractsByAgentId = async (
    agentId: string
  ): Promise<{ success: boolean; contracts: ContractType[] }> => {
    try {
      const res = await api.post(`/api/contract/agent/${agentId}`);
      return res.data;
    } catch (error) {
      console.error("Error in fetchContractsByAgentId:", error);
      throw error;
    }
  };

  /**
   * Find a contract by its ID
   */
  getContractById = async (
    _id: string
  ): Promise<{ success: boolean; contract: ContractType }> => {
    try {
      const res = await api.post(`/api/contract/${_id}`);
      return res.data;
    } catch (error) {
      console.error("Error in getContractById:", error);
      throw error;
    }
  };
}
