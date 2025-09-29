export interface ApplicationType {
  _id: string;
  landdId?: string;
  landName?: string;
  clientName?: string;
  lotIds?: string[];
  clientId?: string;
  agentDealer?: string[];
  otherAgent?: string[];
  appointmentDate?: string;
  status?: string;
  createdAt?: string;
}
