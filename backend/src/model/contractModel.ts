export interface ContractType {
  _id: string;
  clientId?: string;
  agentsIds: string[];
  applicationId?: string;
  contractPDF?: string;
  term?: string;
  createdAt?: string;
}
