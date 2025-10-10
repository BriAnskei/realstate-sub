import { ClientType } from "../../store/slices/clientSlice";
import { api } from "./instance";

export class ClientApi {
  static createClient = async (
    client: FormData
  ): Promise<{ success: boolean; message?: string; client: ClientType }> => {
    try {
      const res = await api.post("/api/client/create", client, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error in createClient:", error);
      throw error;
    }
  };

  static getClients = async (): Promise<ClientType[]> => {
    try {
      const res = await api.get("/api/client/fetch");
      return res.data;
    } catch (error) {
      console.error("Error in getClients:", error);
      throw error;
    }
  };

  static getClientById = async (
    id: string
  ): Promise<{ success: boolean; client?: ClientType; message?: string }> => {
    try {
      const res = await api.get(`/api/client/find/${id}`);

      return res.data;
    } catch (error) {
      console.error("Error in getClientById:", error);
      throw error;
    }
  };

  static updateClient = async (
    id: number,
    client: Partial<ClientType>
  ): Promise<{ client?: ClientType; success: boolean; message?: string }> => {
    try {
      console.log("Cliendd paylaod: ", client);

      const res = await api.put(`/api/client/update/${id}`, client);

      return res.data;
    } catch (error) {
      console.error("Error in updateClient:", error);
      throw error;
    }
  };

  static search = async (payload: {
    name?: string;
    status?: string;
  }): Promise<{ clients: ClientType[] }> => {
    try {
      const res = await api.get(`/api/client/search`, {
        params: { name: payload.name, status: payload.status },
      });
      return res.data;
    } catch (error) {
      console.error("Error in updateClient:", error);
      throw error;
    }
  };

  static deleteClient = async (
    id: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.delete(`/api/client/delete/${id}`);

      return res.data;
    } catch (error) {
      console.error("Error in deleteClient:", error);
      throw error;
    }
  };
}
