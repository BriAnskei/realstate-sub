import { ClientType } from "../../store/slices/clientSlice";
import { api } from "./instance";

export class ClientApi {
  constructor() {}

  createClient = async (client: ClientType) => {
    try {
      const res = await api.post("/api/clients", client);
      return res.data;
    } catch (error) {
      console.error("Error in createClient:", error);
      throw error;
    }
  };

  getClients = async (): Promise<ClientType[]> => {
    try {
      const res = await api.get("/api/clients");
      return res.data;
    } catch (error) {
      console.error("Error in getClients:", error);
      throw error;
    }
  };

  getClientById = async (id: number): Promise<ClientType> => {
    try {
      const res = await api.get(`/api/clients/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in getClientById:", error);
      throw error;
    }
  };

  updateClient = async (id: number, client: Partial<ClientType>) => {
    try {
      const res = await api.put(`/api/clients/${id}`, client);
      return res.data;
    } catch (error) {
      console.error("Error in updateClient:", error);
      throw error;
    }
  };

  deleteClient = async (id: number) => {
    try {
      const res = await api.delete(`/api/clients/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error in deleteClient:", error);
      throw error;
    }
  };
}
