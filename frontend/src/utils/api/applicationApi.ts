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

  static getAll = async (): Promise<{ applications: ApplicationType[] }> => {
    try {
      const res = await api.get("/api/application/get/all");

      return res.data;
    } catch (error) {
      console.log("Error in getAll", error);
      throw error;
    }
  };
}
