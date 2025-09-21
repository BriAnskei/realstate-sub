import { LotType } from "../../store/slices/lotSlice";
import { api } from "./instance";

export class LotApi {
  constructor() {}

  deleteLot = async (id: number) => {
    try {
      const res = await api.post(`/api/lot/lots/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in deleteLot:", error);
      throw error;
    }
  };

  findLotById = async (id: number) => {
    try {
      const res = await api.post(`/api/lot/find/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in findLotById:", error);
      throw error;
    }
  };

  getLots = async (
    cursor?: string,
    limit: number = 10
  ): Promise<{
    hasMore: boolean;
    lots: LotType[];
    messsage: string;
    success: boolean;
  }> => {
    console.log("fething lots api");

    try {
      const res = await api.get("/api/lot/lots", {
        params: { cursor, limit },
      });
      return res.data;
    } catch (error) {
      console.error("Error in getLots:", error);
      throw error;
    }
  };

  searchLotsByLandName = async (name: string) => {
    try {
      const res = await api.get("/api/lot/lots/search", {
        params: { name },
      });
      return res.data;
    } catch (error) {
      console.error("Error in searchLotsByLandName:", error);
      throw error;
    }
  };
}
