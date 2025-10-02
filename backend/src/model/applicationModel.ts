export interface ApplicationType {
  _id?: string;
  landId: string;
  landName: string;
  clientName: string;
  lotIds: string[];
  clientId: string;
  agentDealerId: string;
  otherAgentIds: string[] ;
  appointmentDate: string;
  status: string;
  createdAt: string;
}
