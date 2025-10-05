import { ApplicationType } from "../../store/slices/applicationSlice";
import { api } from "./instance";

export class AppApi {
  constructor() {}

  static add = async (
    payload: ApplicationType
  ): Promise<{
    success: boolean;
    message: string;
    data: ApplicationType;
  }> => {
    try {
      const res = await api.post("/api/application/add", payload);

      return res.data;
    } catch (error) {
      console.log("Error in add, ", error);
      throw error;
    }
  };

  static update = async (payload: {
    applicationId: string;
    updateData: Partial<ApplicationType>;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const { applicationId, updateData } = payload;
      console.log("appliction data: ", updateData);
      const res = await api.post(
        `/api/application/update/${applicationId}`,
        updateData
      );
      console.log("udpate appliction response; ", res);

      return res.data;
    } catch (error) {
      console.log("Error in update", error);
      throw error;
    }
  };

  //
  static updateStatus = async (payload: {
    applicationId: string;
    status: string;
  }): Promise<{ success: boolean }> => {
    try {
      const res = await api.post(
        `/api/application/status-update/${payload.applicationId}`,
        { status: payload.status }
      );

      return res.data;
    } catch (error) {
      console.log("Error in update", error);
      throw error;
    }
  };

  static getAll = async (): Promise<{ applications: ApplicationType[] }> => {
    try {
      const res = await api.get("/api/application/get/all");

      return res.data;
    } catch (error) {
      console.log("Error in getAll", error);
      throw error;
    }
  };

  /**
   *
   * @param agentId
   * @returns returns the Applications of agents(dealer/other)
   */
  static getAllByAgentId = async (
    agentId: string
  ): Promise<{ applications: ApplicationType[] }> => {
    try {
      const res = await api.get(`/api/application/get/by-agents/${agentId}`);

      return res.data;
    } catch (error) {
      console.log("Error in  getAllByAgentId", error);
      throw error;
    }
  };

  static getFilteredApp = async (payload: {
    agentId?: string;
    filter: { searchQuery?: string; status?: string };
  }): Promise<{ applications: ApplicationType[] }> => {
    try {
      const { agentId, filter } = payload;
      console.log("filter payload: ", payload);
      const res = await api.get(`/api/application/filter/${agentId}`, {
        params: filter,
      });

      return res.data;
    } catch (error) {
      console.log("Error in getFilterByAgent ", error);
      throw error;
    }
  };

  static delete = async (
    applicationId: string
  ): Promise<{ success: boolean }> => {
    try {
      const res = await api.post(`/api/application/delete/${applicationId}`);

      return res.data;
    } catch (error) {
      console.log("Error in delete", error);
      throw error;
    }
  };
}
