import { ApplicationType } from "../../store/slices/applicationSlice";
import { ReserveType } from "../../store/slices/reservationSlice";
import { api } from "./instance";

export class ReservationApi {
  constructor() {}

  static createReservation = async (payload: {
    reservation: ReserveType;
    application: ApplicationType;
  }): Promise<{
    success: boolean;
    message?: string;
    reservation: ReserveType;
    application: ApplicationType;
  }> => {
    try {
      const res = await api.post("/api/reservation/add", { ...payload });
      console.log("response: ", res);
      return res.data;
    } catch (error) {
      console.error("Error in createReservation:", error);
      throw error;
    }
  };

  static getAllReservations = async (): Promise<{
    reservations: ReserveType[];
  }> => {
    try {
      const res = await api.get("/api/reservation/get/all");
      return res.data;
    } catch (error) {
      console.error("Error in getAllReservations:", error);
      throw error;
    }
  };
  static getFilter = async (payload: {
    searchQuery?: string;
    status?: string;
  }): Promise<{ reservation: ReserveType }> => {
    try {
      const res = await api.get("/api/reservation/get/filter", {
        params: payload,
      });
      return res.data;
    } catch (error) {
      console.error("Error in getAllReservations:", error);
      throw error;
    }
  };

  getReservationById = async (id: number): Promise<ReserveType> => {
    try {
      const res = await api.get(`/api/reservation/get/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in getReservationById:", error);
      throw error;
    }
  };

  updateReservation = async (
    id: number,
    updates: Partial<Omit<ReserveType, "reserveId" | "createdAt">>
  ): Promise<ReserveType> => {
    try {
      const res = await api.post(`/api/reservations/update/${id}`, updates);
      return res.data;
    } catch (error) {
      console.error("Error in updateReservation:", error);
      throw error;
    }
  };

  static rejectReservation = async (payload: {
    reservation: ReserveType;
    status: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    application: ApplicationType;
  }> => {
    try {
      const res = await api.post("/api/reservation/reject", payload);
      return res.data;
    } catch (error) {
      console.error("Error in rejectReservation:", error);
      throw error;
    }
  };

  deleteReservation = async (
    id: number
  ): Promise<{ message: string; success: boolean }> => {
    try {
      const res = await api.post(`/api/reservations/delete/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in deleteReservation:", error);
      throw error;
    }
  };

  updateReservationStatus = async (
    id: number,
    status: "pending" | "confirmed" | "cancelled" | "completed"
  ): Promise<ReserveType> => {
    try {
      const res = await api.post(`/api/reservations/update/${id}`, { status });
      return res.data;
    } catch (error) {
      console.error("Error in updateReservationStatus:", error);
      throw error;
    }
  };
}
