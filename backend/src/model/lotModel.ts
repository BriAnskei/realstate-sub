export interface Lot {
  _id?: number;
  landId: number;
  blockNumber: number;
  lotNumber: number;
  lotSize: number;
  pricePerSqm: number;
  totalAmount: number;
  lotType: string;
  status: string;
  createdAt?: string;
}
