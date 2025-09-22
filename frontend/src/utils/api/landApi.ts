import { LandTypes } from "../../store/slices/landSlice";
import { LotType } from "../../store/slices/lotSlice";
import errorThrower from "../errorLogger";
import { api } from "./instance";

export class LandApi {
  constructor() {}

  addLand = async (payload: {
    land: LandTypes;
    lots: LotType[];
  }): Promise<{ land: LandTypes; lots: LotType[] }> => {
    try {
      console.log("payload api: ", payload);

      const res = await api.post("/api/land/add", {
        landData: payload.land,
        lots: payload.lots,
      });
      console.log("res: ", res);

      return res.data;
    } catch (error) {
      errorThrower("addLand", error);
      throw error;
    }
  };

  getLands = async (): Promise<LandTypes[]> => {
    try {
      const res = await api.get("/api/land/get");
      return res.data;
    } catch (error) {
      console.error("Error in getLands:", error);
      throw error;
    }
  };

  findLandById = async (id: number) => {
    try {
      const res = await api.get(`/api/land/find/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in findLandById:", error);
      throw error;
    }
  };

  updateLand = async (id: number, land: Partial<LandTypes>) => {
    try {
      const res = await api.post(`/api/land/update/${id}`, { land });
      return res.data;
    } catch (error) {
      console.error("Error in updateLand:", error);
      throw error;
    }
  };

  deleteLand = async (id: number) => {
    try {
      const res = await api.post("/api/land/delete", { _id: id });
      return res.data;
    } catch (error) {
      console.error("Error in deleteLand:", error);
      throw error;
    }
  };
}
