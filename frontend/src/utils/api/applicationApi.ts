import { ApplicationType } from "../../store/slices/applicationSlice";
import { ReserveType } from "../../store/slices/reservationSlice";
import { api } from "./instance";

export class AppApi {
  constructor() {}

  static add = async (
    payload: ApplicationType
  ): Promise<{
    success: boolean;
    message: string;
    application: ApplicationType;
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

      return res.data;
    } catch (error) {
      console.log("Error in update", error);
      throw error;
    }
  };

  static getById = async (
    applicationId: string
  ): Promise<{ success: boolean; data: ApplicationType }> => {
    try {
      const res = await api.get(`/api/application/get/byId/${applicationId}`);
      console.log("fetching reponse: ", res.data);
      return res.data;
    } catch (error) {
      console.log("Error in getById", error);
      throw error;
    }
  };

  /**
   * Updates the status of an application.
   *
   * ⚠️ **Access Restriction:** Only users with type "Employee" can call this method.
   *
   * @param payload - The data needed to update the status.
   * @param payload.applicationId - The ID of the application to update.
   * @param payload.newStatus - The new status value.
   *
   */
  static updateStatus = async (payload: {
    application: ApplicationType;
    status: "approved" | "rejected";
    note?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    reservation?: ReserveType;
  }> => {
    try {
      const { application, status, note } = payload;

      console.log("updating stats payload: ", payload);

      const res = await api.post(
        `/api/application/update/status/${application._id}`,
        {
          status,
          note,
          application,
        }
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

  static getRejectedApByAgentId = async (
    agentId: string
  ): Promise<{
    application: ApplicationType[];
  }> => {
    try {
      const res = await api.post("/api/application/get/rejected", { agentId });

      return res.data;
    } catch (error) {
      console.log("Error in getRejectedApByAgentId, ", error);
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
