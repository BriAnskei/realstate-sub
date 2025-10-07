export interface ReserveType {
  _id?: number;
  applicationId: number;
  clientName: string;
  status: string;
  notes?: string | null;
  createdAt?: string;
}
