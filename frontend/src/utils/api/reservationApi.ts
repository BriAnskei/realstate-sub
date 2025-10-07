import { ReserveType } from "../../store/slices/reservationSlice";
import { api } from "./instance";

export class ReservationApi {
  constructor() {}

  createReservation = async (
    reservation: Omit<ReserveType, "reserveId" | "createdAt">
  ): Promise<ReserveType> => {
    try {
      const res = await api.post("/api/reservation/add", reservation);
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

  //   getReservationsByClientName = async (
  //     clientName: string
  //   ): Promise<{ reservations: ReserveType[] }> => {
  //     try {
  //       const res = await api.get("/api/reservation/get/all");
  //       const filteredReservations = res.data.filter((reservation: ReserveType) =>
  //         reservation.clientName.toLowerCase().includes(clientName.toLowerCase())
  //       );
  //       return { reservations: filteredReservations };
  //     } catch (error) {
  //       console.error("Error in getReservationsByClientName:", error);
  //       throw error;
  //     }
  //   };
}
