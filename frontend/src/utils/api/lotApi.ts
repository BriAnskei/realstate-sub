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

  findLotsByLandId = async (landId: string): Promise<{ lots: LotType[] }> => {
    try {
      const res = await api.post(`/api/lot/find/landId/${landId}`);
      return res.data;
    } catch (error) {
      console.log("Error in findLotsByLandId", error);
      throw error;
    }
  };

  getLots = async (payload: {
    cursor?: string;
    limit?: number;
  }): Promise<{
    hasMore: boolean;
    lots: LotType[];
    messsage: string;
    success: boolean;
  }> => {
    try {
      const res = await api.get("/api/lot/lots", {
        params: payload,
      });
      return res.data;
    } catch (error) {
      console.error("Error in getLots:", error);
      throw error;
    }
  };

  searchLotsByLandName = async (payload: {
    landName: string;
    status?: string;
  }) => {
    try {
      const res = await api.get("/api/lot/lots/search", {
        params: payload,
      });
      return res.data;
    } catch (error) {
      console.error("Error in searchLotsBylotName:", error);
      throw error;
    }
  };

  updateLot = async (id: number, lot: Partial<LotType>) => {
    try {
      const res = await api.post(`/api/lot/update/${id}`, { lot });
      return res.data;
    } catch (error) {
      console.error("Error in updateLot:", error);
      throw error;
    }
  };
}
