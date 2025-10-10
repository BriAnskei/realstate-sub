export interface ReserveType {
  _id?: number;
  applicationId: number;
  clientId: string;
  clientName: string;
  status: string;
  notes?: string | null;
  appointmentDate?: string;
  createdAt?: string;
}
