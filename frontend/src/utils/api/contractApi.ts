import { ApplicationType } from "../../store/slices/applicationSlice";
import { ContractType } from "../../store/slices/contractSlice";
import { ReserveType } from "../../store/slices/reservationSlice";
import { api } from "./instance";

export class ContractApi {
  constructor() {}

  /**
   * Add a new contract
   */
  addContract = async (
    payload: Partial<ContractType>
  ): Promise<{
    contract: ContractType;
    application: ApplicationType;
    reservation: ReserveType;
  }> => {
    try {
      // add first to get the id
      const addRes = await api.post("/api/contract/add", payload);
      const genreatedContract = addRes.data.contract;
      // begin generate pdf and upload to server(the resaon for this is we need to get the contract Id for the directory of the file.)
      const res = await api.post("/api/contract/upload/pdf", {
        contract: genreatedContract,
      });

      return res.data;
    } catch (error) {
      console.error("Error in addContract:", error);
      throw error;
    }
  };

  /**
   * Generate PDF for a contract
   */
  static generateContractPdf = async (payload: {
    clientId: string;
    applicationId: string;
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
   *
   * Filter contract by client name
   */
  filterContract = async (payload: {
    clientName: string;
    agentId?: string;
  }): Promise<{ contract: ContractType }> => {
    try {
      const res = await api.get("/api/contract/search", {
        params: payload,
      });

      return res.data;
    } catch (error) {
      console.log("Error in filterContract", error);
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
      const res = await api.get("/api/contract/get/all");

      console.log("Fetchedd conrtacs: ", res.data);
      return res.data;
    } catch (error) {
      console.error("Error in fetchAllContracts:", error);
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
      const res = await api.get(`/api/contract/get/by-agent/${agentId}`);
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
