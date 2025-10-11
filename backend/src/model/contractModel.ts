export interface ContractType {
  _id: string;
  clientId?: string;
  agentsIds: string[];
  applicationId?: string;
  reservationId?: string;
  clientName?: string;
  landName?: string;
  contractPDF?: string;
  term?: string;
  createdAt?: string;
}
