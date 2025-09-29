import { UserType } from "../../context/UserContext";

export interface ApplicationType {
  _id: string;
  landdId?: string;
  landName?: string;
  clientName?: string;
  lotIds?: string[];
  clientId?: string;
  agentDealer?: UserType;
  otherAgent?: UserType[];
  appointmentDate?: string;
  status?: string;
  createdAt?: string;
}
