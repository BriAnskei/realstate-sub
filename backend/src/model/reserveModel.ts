export type UserStatus = "pending" | "cancellation" | "on_contract" | "no_show"; 

export interface ReserveType {
    id?: number;
    applicationId: number; 
    clientName: string;
    status: UserStatus;
    notes: string;
    createdAt?: string;
}